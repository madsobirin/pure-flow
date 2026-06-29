import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { formatLocalDate, formatLocalTime, longDateOptions } from "@/lib/date";
import type { Metadata } from "next";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import BottomNav from "../../../components/dashboard/BottomNav";
import LogDetailClient from "./LogDetailClient";

interface JwtPayload {
  userId: number;
  email: string;
}

// Generate metadata dinamis untuk SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const logId = parseInt(id);
  if (isNaN(logId)) return { title: "Catatan Latihan Tidak Ditemukan" };

  const log = await prisma.logLatihan.findUnique({
    where: { id: logId },
    include: {
      alat: {
        select: { nama_alat: true },
      },
    },
  });

  if (!log) return { title: "Catatan Latihan Tidak Ditemukan" };

  return {
    title: `Latihan ${log.alat?.nama_alat || "Alat"} - Gym Tracker`,
    description: `Catatan latihan: ${log.jumlah_set} Sets • ${log.jumlah_repetisi} Reps`,
  };
}

export default async function LogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let userId: number;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");
    const decoded = jwt.verify(token, secret) as JwtPayload;
    userId = decoded.userId;
  } catch (error) {
    console.error("JWT verification failed in log detail page:", error);
    redirect("/login");
  }

  const { id } = await params;
  const logId = parseInt(id);
  if (isNaN(logId)) {
    notFound();
  }

  const log = await prisma.logLatihan.findFirst({
    where: { id: logId, user_id: userId },
    include: {
      alat: {
        select: {
          id: true,
          nama_alat: true,
          foto_path: true,
        },
      },
    },
  });

  if (!log) {
    notFound();
  }

  const formattedLog = {
    id: log.id,
    jumlah_set: log.jumlah_set,
    jumlah_repetisi: log.jumlah_repetisi,
    berat_alat: log.berat_alat,
    catatan_latihan: log.catatan_latihan,
    tanggal_latihan: log.tanggal_latihan.toISOString(),
    formattedDate: formatLocalDate(log.tanggal_latihan, longDateOptions),
    formattedTime: formatLocalTime(log.tanggal_latihan),
    alat: log.alat ? {
      id: log.alat.id,
      nama_alat: log.alat.nama_alat,
      foto_path: log.alat.foto_path,
    } : null,
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />
          <LogDetailClient log={formattedLog} />
        </div>

        <BottomNav activeTab="log" />
      </div>
    </div>
  );
}
