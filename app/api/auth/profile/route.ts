import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, unauthorizedResponse } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    // Verify JWT token from cookie
    const payload = verifyToken(request);
    if (!payload) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { name } = body;

    // Validate name
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama tidak valid. Nama minimal harus terdiri dari 2 karakter.",
        },
        { status: 422 }
      );
    }

    // Update name in database
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Nama berhasil diperbarui.",
        data: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PUT /api/auth/profile]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui profil. Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
