import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import BottomNav from "../../../../components/dashboard/BottomNav";
import EditLogForm from "./EditLogForm";

interface JwtPayload {
  userId: number;
  email: string;
}

export default async function EditLogPage({
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
    console.error("JWT verification failed in log edit page:", error);
    redirect("/login");
  }

  const { id } = await params;
  const logId = parseInt(id);
  if (isNaN(logId)) {
    notFound();
  }

  // Ambil data log latihan
  const log = await prisma.logLatihan.findFirst({
    where: { id: logId, user_id: userId },
  });

  if (!log) {
    notFound();
  }

  // Ambil daftar alat milik user untuk dropdown pilihan alat
  const equipments = await prisma.alat.findMany({
    where: { user_id: userId },
    select: { id: true, nama_alat: true },
    orderBy: { nama_alat: "asc" },
  });

  const formattedLog = {
    id: log.id,
    alat_id: log.alat_id,
    jumlah_set: log.jumlah_set,
    jumlah_repetisi: log.jumlah_repetisi,
    catatan_latihan: log.catatan_latihan,
    tanggal_latihan: log.tanggal_latihan.toISOString(),
  };

  const formattedEquipments = equipments.map((eq) => ({
    id: eq.id,
    nama_alat: eq.nama_alat,
  }));

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />
          <EditLogForm log={formattedLog} equipments={formattedEquipments} />
        </div>

        <BottomNav activeTab="log" />
      </div>
    </div>
  );
}
