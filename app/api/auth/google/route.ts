import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error("GOOGLE_CLIENT_ID is not defined");
    return NextResponse.json(
      { success: false, message: "Google Client ID is tidak terkonfigurasi di server." },
      { status: 500 }
    );
  }

  // Generate a random state to prevent CSRF attacks
  const state = crypto.randomUUID();
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // Construct Google Auth URL
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("prompt", "select_account");

  // Store the state in a cookie for validation in the callback
  const response = NextResponse.redirect(googleAuthUrl.toString());
  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3600, // 1 hour
    sameSite: "lax",
  });

  return response;
}
