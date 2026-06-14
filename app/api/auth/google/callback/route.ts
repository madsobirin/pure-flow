import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  id_token: string;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Retrieve state from cookies to prevent CSRF
  const savedState = request.cookies.get("google_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    console.error("OAuth State mismatch or missing parameters", { code, state, savedState });
    return NextResponse.redirect(new URL("/login?error=invalid_state", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing");
    return NextResponse.redirect(new URL("/login?error=server_configuration", request.url));
  }

  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  try {
    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Failed to exchange auth code for tokens:", errorText);
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", request.url));
    }

    const tokens = (await tokenResponse.json()) as GoogleTokenResponse;

    // 2. Fetch user information using access token
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text();
      console.error("Failed to fetch user info from Google:", errorText);
      return NextResponse.redirect(new URL("/login?error=user_info_failed", request.url));
    }

    const googleUser = (await userInfoResponse.json()) as GoogleUserInfo;

    if (!googleUser.email) {
      console.error("Google account does not have an email associated");
      return NextResponse.redirect(new URL("/login?error=no_email", request.url));
    }

    // 3. Resolve user in Database
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { google_id: googleUser.sub },
          { email: googleUser.email.toLowerCase() },
        ],
      },
    });

    if (dbUser) {
      // User exists. Ensure google_id and image_url are set/updated
      const updateData: { google_id?: string; image_url?: string } = {};
      if (!dbUser.google_id) {
        updateData.google_id = googleUser.sub;
      }
      if (googleUser.picture && (!dbUser.image_url || dbUser.image_url.startsWith("http"))) {
        updateData.image_url = googleUser.picture;
      }

      if (Object.keys(updateData).length > 0) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: updateData,
        });
      }
    } else {
      // Create a new user
      dbUser = await prisma.user.create({
        data: {
          name: googleUser.name || googleUser.email.split("@")[0],
          email: googleUser.email.toLowerCase(),
          google_id: googleUser.sub,
          image_url: googleUser.picture || null,
          password: null, // No password for OAuth users
        },
      });
    }

    // 4. Generate application session JWT token
    const authToken = signToken({
      userId: dbUser.id,
      email: dbUser.email,
      rememberMe: true, // OAuth is typically remember-me by default
    });

    // 5. Redirect with cookies set
    const response = NextResponse.redirect(new URL("/", request.url));
    
    // Set our application session token cookie
    response.cookies.set("auth_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 3600, // 7 days (since rememberMe is true)
      sameSite: "lax",
    });

    // Clear the oauth state cookie
    response.cookies.delete("google_oauth_state");

    return response;
  } catch (error) {
    console.error("Google authentication error during callback processing:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", request.url));
  }
}
