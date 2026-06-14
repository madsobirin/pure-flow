import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorizedResponse } from "@/lib/auth";

interface UpdateLogBody {
  alat_id?: number;
  jumlah_set?: number;
  jumlah_repetisi?: number;
  catatan_latihan?: string | null;
  tanggal_latihan?: string;
}

// ============================================================
// PUT /api/log/[id] (Protected — Edit Catatan Latihan)
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
    const logId = parseInt(id);
    if (isNaN(logId)) {
      return Response.json(
        { success: false, message: "ID log tidak valid." },
        { status: 400 }
      );
    }

    // Pastikan log tersebut milik user yang request
    const existingLog = await prisma.logLatihan.findFirst({
      where: { id: logId, user_id: userId },
    });

    if (!existingLog) {
      return Response.json(
        { success: false, message: "Catatan latihan tidak ditemukan atau bukan milik Anda." },
        { status: 404 }
      );
    }

    const body: UpdateLogBody = await request.json();
    const { alat_id, jumlah_set, jumlah_repetisi, catatan_latihan, tanggal_latihan } = body;

    // Validasi input minimal
    if (alat_id !== undefined) {
      const existingAlat = await prisma.alat.findFirst({
        where: { id: alat_id, user_id: userId },
      });
      if (!existingAlat) {
        return Response.json(
          { success: false, message: "Alat tidak ditemukan atau bukan milik Anda." },
          { status: 422 }
        );
      }
    }

    const updatedLog = await prisma.logLatihan.update({
      where: { id: logId },
      data: {
        alat_id: alat_id !== undefined ? alat_id : existingLog.alat_id,
        jumlah_set: jumlah_set !== undefined ? jumlah_set : existingLog.jumlah_set,
        jumlah_repetisi: jumlah_repetisi !== undefined ? jumlah_repetisi : existingLog.jumlah_repetisi,
        catatan_latihan: catatan_latihan !== undefined ? catatan_latihan : existingLog.catatan_latihan,
        tanggal_latihan: tanggal_latihan !== undefined ? new Date(tanggal_latihan) : existingLog.tanggal_latihan,
      },
    });

    return Response.json({
      success: true,
      message: "Catatan latihan berhasil diperbarui.",
      data: updatedLog,
    });
  } catch (error) {
    console.error("[PUT /api/log/[id]]", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE /api/log/[id] (Protected — Hapus Catatan Latihan)
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
    const logId = parseInt(id);
    if (isNaN(logId)) {
      return Response.json(
        { success: false, message: "ID log tidak valid." },
        { status: 400 }
      );
    }

    // Pastikan log tersebut milik user yang request
    const existingLog = await prisma.logLatihan.findFirst({
      where: { id: logId, user_id: userId },
    });

    if (!existingLog) {
      return Response.json(
        { success: false, message: "Catatan latihan tidak ditemukan atau bukan milik Anda." },
        { status: 404 }
      );
    }

    await prisma.logLatihan.delete({
      where: { id: logId },
    });

    return Response.json({
      success: true,
      message: "Catatan latihan berhasil dihapus.",
    });
  } catch (error) {
    console.error("[DELETE /api/log/[id]]", error);
    return Response.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
