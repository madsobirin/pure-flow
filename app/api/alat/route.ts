import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, unauthorizedResponse } from "@/lib/auth";
import sharp from "sharp";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

const uploadFromBuffer = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "pure_flow",
        resource_type: "image",
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined,
      ) => {
        if (error) return reject(error);
        if (!result)
          return reject(
            new Error(
              "Upload ke Cloudinary gagal, tidak ada hasil yang dikembalikan.",
            ),
          );

        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });
};

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
        { status: 422 },
      );
    }

    if (!fotoAlat || !(fotoAlat instanceof File)) {
      return Response.json(
        {
          success: false,
          message: "Field foto_alat (file gambar) wajib diunggah.",
        },
        { status: 422 },
      );
    }

    // --- Proses kompresi gambar menggunakan Sharp ---
    const bytes = await fotoAlat.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);

    let optimizedBuffer: Buffer;
    try {
      optimizedBuffer = await sharp(inputBuffer)
        .resize({
          width: 1200, // Maksimal lebar 1200px
          height: 1200, // Maksimal tinggi 1200px
          fit: "inside", // Jaga rasio aspek
          withoutEnlargement: true, // Jangan perbesar jika gambar aslinya kecil
        })
        .webp({ quality: 75 }) // Konversi paksa ke WebP dengan kualitas 75%
        .toBuffer();
    } catch (sharpError) {
      console.error("Error compressing image with sharp:", sharpError);
      return Response.json(
        {
          success: false,
          message: "Gagal memproses dan mengompresi gambar.",
        },
        { status: 500 },
      );
    }

    // --- Upload ke Cloudinary ---
    let fotoPath = "";
    try {
      const uploadResult = await uploadFromBuffer(optimizedBuffer);
      fotoPath = uploadResult.secure_url;
    } catch (uploadError) {
      console.error("Cloudinary upload failed:", uploadError);
      return Response.json(
        {
          success: false,
          message: "Gagal mengunggah gambar ke cloud storage.",
        },
        { status: 500 },
      );
    }

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
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/alat]", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 },
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
      { status: 200 },
    );
  } catch (error) {
    console.error("[GET /api/alat]", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 },
    );
  }
}
