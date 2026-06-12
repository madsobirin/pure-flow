import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, unauthorizedResponse } from "@/lib/auth";

// ============================================================
// Types
// ============================================================

interface LogLatihanBody {
  alat_id?: number;
  jumlah_set?: number;
  jumlah_repetisi?: number;
  catatan_latihan?: string;
}

// ============================================================
// POST /api/log-latihan (Protected — Catat Latihan Harian)
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // --- Auth check ---
    const payload = verifyToken(request);
    if (!payload) return unauthorizedResponse();

    const body: LogLatihanBody = await request.json();
    const { alat_id, jumlah_set, jumlah_repetisi, catatan_latihan } = body;

    // --- Validasi input ---
    if (!alat_id || !jumlah_set || !jumlah_repetisi) {
      return Response.json(
        {
          success: false,
          message: "Field alat_id, jumlah_set, dan jumlah_repetisi wajib diisi.",
        },
        { status: 422 }
      );
    }

    // --- Validasi alat_id milik user ---
    const alat = await prisma.alat.findFirst({
      where: {
        id: alat_id,
        user_id: payload.userId,
      },
    });

    if (!alat) {
      return Response.json(
        {
          success: false,
          message: "Alat tidak ditemukan atau bukan milik Anda.",
        },
        { status: 404 }
      );
    }

    // --- Simpan log latihan ---
    const logLatihan = await prisma.logLatihan.create({
      data: {
        user_id: payload.userId,
        alat_id,
        jumlah_set,
        jumlah_repetisi,
        catatan_latihan: catatan_latihan || null,
        tanggal_latihan: new Date(), // Timestamp otomatis saat ini
      },
      include: {
        alat: {
          select: {
            nama_alat: true,
            foto_path: true,
          },
        },
      },
    });

    return Response.json(
      {
        success: true,
        message: "Log latihan berhasil disimpan.",
        data: logLatihan,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/log-latihan]", error);
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
// GET /api/log-latihan?tanggal=YYYY-MM-DD (Protected — Riwayat Latihan)
// ============================================================

export async function GET(request: NextRequest) {
  try {
    // --- Auth check ---
    const payload = verifyToken(request);
    if (!payload) return unauthorizedResponse();

    // --- Parse query parameter ---
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get("tanggal"); // Format: YYYY-MM-DD

    if (!tanggal) {
      return Response.json(
        {
          success: false,
          message: "Query parameter 'tanggal' wajib diisi (format: YYYY-MM-DD).",
        },
        { status: 422 }
      );
    }

    // --- Validasi format tanggal ---
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(tanggal)) {
      return Response.json(
        {
          success: false,
          message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD.",
        },
        { status: 422 }
      );
    }

    // --- Buat range tanggal (awal hari - akhir hari) ---
    const startOfDay = new Date(`${tanggal}T00:00:00.000Z`);
    const endOfDay = new Date(`${tanggal}T23:59:59.999Z`);

    // --- Query log latihan berdasarkan user_id DAN tanggal ---
    const logs = await prisma.logLatihan.findMany({
      where: {
        user_id: payload.userId,
        tanggal_latihan: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        alat: {
          select: {
            id: true,
            nama_alat: true,
            foto_path: true,
          },
        },
      },
      orderBy: { tanggal_latihan: "desc" },
    });

    return Response.json(
      {
        success: true,
        tanggal,
        data: logs,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/log-latihan]", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 }
    );
  }
}
