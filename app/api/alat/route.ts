import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, unauthorizedResponse } from "@/lib/auth";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

// ============================================================
// POST /api/alat (Protected — Tambah Master Alat)
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // --- Auth check ---
    const payload = verifyToken(request);
    if (!payload) return unauthorizedResponse();

    // --- Parse multipart/form-data ---
    const formData = await request.formData();
    const namaAlat = formData.get("nama_alat") as string | null;
    const fotoAlat = formData.get("foto_alat") as File | null;
    const catatanAlat = formData.get("catatan_alat") as string | null;

    // --- Validasi input ---
    if (!namaAlat) {
      return Response.json(
        {
          success: false,
          message: "Field nama_alat wajib diisi.",
        },
        { status: 422 }
      );
    }

    if (!fotoAlat || !(fotoAlat instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "Field foto_alat (file gambar) wajib diunggah.",
        },
        { status: 422 }
      );
    }

    // --- Simpan file gambar ---
    // Placeholder: Simpan ke public/uploads/ (bisa diganti ke cloud storage nanti)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const safeFileName = fotoAlat.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${timestamp}_${safeFileName}`;
    const filePath = path.join(uploadsDir, fileName);

    const bytes = await fotoAlat.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Path yang disimpan di DB (relatif untuk akses frontend)
    const fotoPath = `/uploads/${fileName}`;

    // --- Simpan ke database ---
    const alat = await prisma.alat.create({
      data: {
        user_id: payload.userId,
        nama_alat: namaAlat,
        foto_path: fotoPath,
        catatan_alat: catatanAlat || null,
      },
    });

    return Response.json(
      {
        success: true,
        message: "Alat berhasil ditambahkan.",
        data: alat,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/alat]", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}

// ============================================================
// GET /api/alat (Protected — Ambil Semua Alat Milik User)
// ============================================================

export async function GET(request: NextRequest) {
  try {
    // --- Auth check ---
    const payload = verifyToken(request);
    if (!payload) return unauthorizedResponse();

    // --- Query semua alat milik user ---
    const alatList = await prisma.alat.findMany({
      where: { user_id: payload.userId },
      orderBy: { created_at: "desc" },
    });

    return Response.json(
      {
        success: true,
        message: "Data alat berhasil diambil.",
        data: alatList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/alat]", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
