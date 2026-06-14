import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorizedResponse } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Helper untuk mengunggah buffer ke Cloudinary
const uploadFromBuffer = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "pure_flow",
        resource_type: "image",
        // Kompresi & konversi ke WebP dilakukan oleh Cloudinary (serverless-safe)
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit",      // Setara fit:'inside' — tidak memperbesar
            quality: "auto:good",
            fetch_format: "webp",
          },
        ],
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) return reject(error);
        if (!result) {
          return reject(
            new Error("Gagal mengunggah ke Cloudinary, respons kosong.")
          );
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// ============================================================
// PUT /api/alat/[id] (Protected — Edit Alat)
// ============================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userIdStr = request.headers.get("x-user-id");
    if (!userIdStr) return unauthorizedResponse();
    const userId = parseInt(userIdStr, 10);

    const { id } = await params;
    const alatId = parseInt(id);
    if (isNaN(alatId)) {
      return Response.json(
        { success: false, message: "ID alat tidak valid." },
        { status: 400 }
      );
    }

    // Pastikan alat tersebut milik user yang request
    const existingAlat = await prisma.alat.findFirst({
      where: { id: alatId, user_id: userId },
    });

    if (!existingAlat) {
      return Response.json(
        { success: false, message: "Alat tidak ditemukan atau bukan milik Anda." },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const namaAlat = formData.get("nama_alat") as string | null;
    const catatanAlat = formData.get("catatan_alat") as string | null;
    const fotoAlat = formData.get("foto_alat") as File | null;

    if (!namaAlat) {
      return Response.json(
        { success: false, message: "Nama alat wajib diisi." },
        { status: 422 }
      );
    }

    let fotoPath = existingAlat.foto_path;

    // Jika user mengunggah foto baru
    if (fotoAlat && fotoAlat instanceof File && fotoAlat.size > 0) {
      const bytes = await fotoAlat.arrayBuffer();
      const optimizedBuffer = Buffer.from(bytes);

      // Kompresi & konversi WebP ditangani Cloudinary saat upload
      try {
        const uploadResult = await uploadFromBuffer(optimizedBuffer);
        fotoPath = uploadResult.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return Response.json(
          { success: false, message: "Gagal mengunggah gambar ke cloud storage." },
          { status: 500 }
        );
      }
    }

    const updatedAlat = await prisma.alat.update({
      where: { id: alatId },
      data: {
        nama_alat: namaAlat.trim(),
        catatan_alat: catatanAlat ? catatanAlat.trim() : null,
        foto_path: fotoPath,
      },
    });

    return Response.json({
      success: true,
      message: "Alat berhasil diperbarui.",
      data: updatedAlat,
    });
  } catch (error) {
    console.error("[PUT /api/alat/[id]]", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/alat/[id] (Protected — Hapus Alat)
// ============================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userIdStr = request.headers.get("x-user-id");
    if (!userIdStr) return unauthorizedResponse();
    const userId = parseInt(userIdStr, 10);

    const { id } = await params;
    const alatId = parseInt(id);
    if (isNaN(alatId)) {
      return Response.json(
        { success: false, message: "ID alat tidak valid." },
        { status: 400 }
      );
    }

    // Pastikan alat tersebut milik user yang request
    const existingAlat = await prisma.alat.findFirst({
      where: { id: alatId, user_id: userId },
    });

    if (!existingAlat) {
      return Response.json(
        { success: false, message: "Alat tidak ditemukan atau bukan milik Anda." },
        { status: 404 }
      );
    }

    // Hapus dari database (Prisma cascading delete akan otomatis menghapus logLatihan terkait karena onDelete: Cascade di schema)
    await prisma.alat.delete({
      where: { id: alatId },
    });

    return Response.json({
      success: true,
      message: "Alat berhasil dihapus.",
    });
  } catch (error) {
    console.error("[DELETE /api/alat/[id]]", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
