import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to convert base64url string to Uint8Array
const base64UrlToBytes = (str: string): Uint8Array => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const base64UrlDecode = (str: string): string => {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
};

// Helper to verify HS256 JWT signature using Web Crypto API
async function verifyJwt(token: string, secret: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    // Verify signature
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const keyData = encoder.encode(secret);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const signatureBytes = base64UrlToBytes(signatureB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      data,
    );

    if (!isValid) return null;

    // Parse payload
    const payloadStr = base64UrlDecode(payloadB64);
    const payload = JSON.parse(payloadStr);

    // Check expiration if exp is present
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths (assets are already filtered by matcher)
  const isPublicPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/auth/google") ||
    pathname.startsWith("/animation/");

  const token = request.cookies.get("auth_token")?.value;
  const secret = process.env.JWT_SECRET || "";

  let payload = null;
  if (token && secret) {
    payload = await verifyJwt(token, secret);
  }

  // 1. If user is authenticated and tries to access public page paths like /login or /register,
  // redirect them to the home page (/).
  if (payload && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If path is public, let it pass
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 3. If user is NOT authenticated and tries to access private paths
  if (!payload) {
    // For API routes, return 401 Unauthorized instead of a redirect
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Token tidak valid atau tidak ditemukan.",
        },
        { status: 401 },
      );
    }

    // For web page routes, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4. User is authenticated, inject user headers and proceed
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.userId.toString());
  requestHeaders.set("x-user-email", payload.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|lottie)$).*)",
  ],
};
