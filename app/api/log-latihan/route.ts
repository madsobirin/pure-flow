import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { unauthorizedResponse } from "@/lib/auth";

// ============================================================
// Types
// ============================================================

interface LogLatihanBody {
  alat_id?: number;
  jumlah_set?: number;
  jumlah_repetisi?: number;
  catatan_latihan?: string;
  berat_alat?: number;
}

// ============================================================
// POST /api/log-latihan (Protected — Catat Latihan Harian)
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // --- Auth check ---
    const userIdStr = request.headers.get("x-user-id");
    if (!userIdStr) return unauthorizedResponse();
    const userId = parseInt(userIdStr, 10);

    const body: LogLatihanBody = await request.json();
    const {
      alat_id,
      jumlah_set,
      jumlah_repetisi,
      berat_alat,
      catatan_latihan,
    } = body;

    // --- Validasi input ---
    if (!alat_id || !jumlah_set || !jumlah_repetisi || !berat_alat) {
      return Response.json(
        {
          success: false,
          message:
            "Field alat_id, jumlah_set, jumlah_repetisi, dan berat_alat wajib diisi.",
        },
        { status: 422 },
      );
    }

    // --- Validasi alat_id milik user ---
    const alat = await prisma.alat.findFirst({
      where: {
        id: alat_id,
        user_id: userId,
      },
    });

    if (!alat) {
      return Response.json(
        {
          success: false,
          message: "Alat tidak ditemukan atau bukan milik Anda.",
        },
        { status: 404 },
      );
    }

    // --- Simpan log latihan ---
    const logLatihan = await prisma.logLatihan.create({
      data: {
        user_id: userId,
        alat_id,
        jumlah_set,
        jumlah_repetisi,
        berat_alat,
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
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST /api/log-latihan]", error);
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
// GET /api/log-latihan?tanggal=YYYY-MM-DD (Protected — Riwayat Latihan)
// ============================================================

export async function GET(request: NextRequest) {
  try {
    // --- Auth check ---
    const userIdStr = request.headers.get("x-user-id");
    if (!userIdStr) return unauthorizedResponse();
    const userId = parseInt(userIdStr, 10);

    // --- Parse query parameter ---
    const { searchParams } = new URL(request.url);
    const tanggal = searchParams.get("tanggal"); // Format: YYYY-MM-DD
    const bulan = searchParams.get("bulan"); // Format: YYYY-MM

    if (!tanggal && !bulan) {
      return Response.json(
        {
          success: false,
          message:
            "Query parameter 'tanggal' (format: YYYY-MM-DD) atau 'bulan' (format: YYYY-MM) wajib diisi.",
        },
        { status: 422 },
      );
    }

    let logs = [];

    if (bulan) {
      // --- Validasi format bulan ---
      const monthRegex = /^\d{4}-\d{2}$/;
      if (!monthRegex.test(bulan)) {
        return Response.json(
          {
            success: false,
            message: "Format bulan tidak valid. Gunakan format YYYY-MM.",
          },
          { status: 422 },
        );
      }

      const [year, month] = bulan.split("-").map(Number);
      const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      // --- Query log latihan berdasarkan user_id DAN range bulan ---
      logs = await prisma.logLatihan.findMany({
        where: {
          user_id: userId,
          tanggal_latihan: {
            gte: startOfMonth,
            lte: endOfMonth,
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
          bulan,
          data: logs,
        },
        { status: 200 },
      );
    } else if (tanggal) {
      // --- Validasi format tanggal ---
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(tanggal)) {
        return Response.json(
          {
            success: false,
            message: "Format tanggal tidak valid. Gunakan format YYYY-MM-DD.",
          },
          { status: 422 },
        );
      }

      // --- Buat range tanggal (awal hari - akhir hari) ---
      const startOfDay = new Date(`${tanggal}T00:00:00.000Z`);
      const endOfDay = new Date(`${tanggal}T23:59:59.999Z`);

      // --- Query log latihan berdasarkan user_id DAN tanggal ---
      logs = await prisma.logLatihan.findMany({
        where: {
          user_id: userId,
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
        { status: 200 },
      );
    }
  } catch (error) {
    console.error("[GET /api/log-latihan]", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 },
    );
  }
}
