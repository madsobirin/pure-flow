import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatLocalDate, formatLocalTime } from "@/lib/date";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import BottomNav from "../../components/dashboard/BottomNav";
import LogListClient from "./LogListClient";

interface JwtPayload {
  userId: number;
  email: string;
}

export default async function LogListPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    redirect("/login");
  }

  let userId: number;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const decoded = jwt.verify(token, secret) as JwtPayload;
    userId = decoded.userId;
  } catch (error) {
    console.error("JWT verification failed in log list page:", error);
    redirect("/login");
  }

  const logsFromDb = await prisma.logLatihan.findMany({
    where: { user_id: userId },
    include: {
      alat: {
        select: {
          nama_alat: true,
        },
      },
    },
    orderBy: { tanggal_latihan: "desc" },
  });

  const logs = logsFromDb.map((log) => {
    return {
      id: log.id,
      name: log.alat?.nama_alat || "Alat Terhapus",
      sets: log.jumlah_set,
      reps: log.jumlah_repetisi,
      berat_alat: log.berat_alat,
      date: formatLocalDate(log.tanggal_latihan),
      time: formatLocalTime(log.tanggal_latihan),
    };
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />
          <LogListClient initialLogs={logs} />
        </div>

        <BottomNav activeTab="log" />
      </div>
    </div>
  );
}
