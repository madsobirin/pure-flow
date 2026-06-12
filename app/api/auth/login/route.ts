import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

// ============================================================
// Types
// ============================================================

interface LoginBody {
  email?: string;
  password?: string;
  remember_me?: boolean;
}

// ============================================================
// POST /api/auth/login
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: LoginBody = await request.json();
    const { email, password, remember_me = false } = body;

    // --- Validasi input ---
    if (!email || !password) {
      return Response.json(
        {
          success: false,
          message: "Field email dan password wajib diisi.",
        },
        { status: 422 }
      );
    }

    // --- Cek apakah email terdaftar ---
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Email belum terdaftar",
        },
        { status: 404 }
      );
    }

    // --- Cek kecocokan password ---
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          message: "email dan password tidak sesuai",
        },
        { status: 401 }
      );
    }

    // --- Generate JWT token ---
    const token = signToken({
      userId: user.id,
      email: user.email,
      rememberMe: remember_me,
    });

    return Response.json(
      {
        success: true,
        message: "Login berhasil.",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
