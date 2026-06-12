import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// ============================================================
// Types
// ============================================================

export interface JwtPayload {
  userId: number;
  email: string;
}

interface SignTokenOptions {
  userId: number;
  email: string;
  rememberMe?: boolean;
}

// ============================================================
// Helpers
// ============================================================

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

/**
 * Generate a signed JWT token.
 * - Default expiry: 1 hour
 * - With rememberMe: 7 days
 */
export function signToken({ userId, email, rememberMe = false }: SignTokenOptions): string {
  const secret = getSecret();
  const expiresIn = rememberMe ? "7d" : "1h";

  return jwt.sign({ userId, email } satisfies JwtPayload, secret, {
    expiresIn,
  });
}

/**
 * Verify the JWT bearer token from the request's Authorization header.
 * Returns the decoded payload on success, or null on failure.
 */
export function verifyToken(request: NextRequest): JwtPayload | null {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const secret = getSecret();
    const decoded = jwt.verify(token, secret) as JwtPayload;

    return decoded;
  } catch {
    return null;
  }
}

/**
 * Standard 401 Unauthorized JSON response.
 */
export function unauthorizedResponse() {
  return Response.json(
    {
      success: false,
      message: "Unauthorized. Token tidak valid atau tidak ditemukan.",
    },
    { status: 401 }
  );
}
