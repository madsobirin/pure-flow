import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ============================================================
// Types
// ============================================================

interface RegisterBody {
  name?: string;
  email?: string;
  password?: string;
}

// ============================================================
// POST /api/auth/register
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: RegisterBody = await request.json();
    const { name, email, password } = body;

    // --- Validasi input ---
    if (!name || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Field name, email, dan password wajib diisi.",
        },
        { status: 422 }
      );
    }

    // --- Validasi panjang password ---
    if (password.length < 8) {
      return Response.json(
        {
          success: false,
          message: "Password Kurang Dari 8 Character",
        },
        { status: 422 }
      );
    }

    // --- Cek apakah email sudah terdaftar ---
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "email sudah terdaftar",
        },
        { status: 422 }
      );
    }

    // --- Hash password ---
    const hashedPassword = await bcrypt.hash(password, 12);

    // --- Buat user baru ---
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
        updated_at: true,
        // password TIDAK disertakan
      },
    });

    return Response.json(
      {
        success: true,
        message: "Registrasi berhasil.",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/auth/register]", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
