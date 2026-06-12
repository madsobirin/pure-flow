import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface JwtPayload {
  userId: number;
  email: string;
}

interface SignTokenOptions {
  userId: number;
  email: string;
  rememberMe?: boolean;
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

export function signToken({
  userId,
  email,
  rememberMe = false,
}: SignTokenOptions): string {
  const secret = getSecret();
  const expiresIn = rememberMe ? "7d" : "1h";

  return jwt.sign({ userId, email } satisfies JwtPayload, secret, {
    expiresIn,
  });
}

export function verifyToken(request: NextRequest): JwtPayload | null {
  try {
    const tokenCookie = request.cookies.get("auth_token");

    if (!tokenCookie || !tokenCookie.value) {
      return null;
    }

    const token = tokenCookie.value;
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
    { status: 401 },
  );
}
