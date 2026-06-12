import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import BottomNav from "../../components/dashboard/BottomNav";
import Link from "next/link";
import { Plus, CheckCircle2 } from "lucide-react";

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

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const logs = logsFromDb.map((log) => {
    const dateObj = new Date(log.tanggal_latihan);
    const dateStr = new Intl.DateTimeFormat("id-ID", dateOptions).format(dateObj);
    const timeStr = new Intl.DateTimeFormat("id-ID", timeOptions)
      .format(dateObj)
      .replace(":", ".");

    return {
      id: log.id,
      name: log.alat?.nama_alat || "Alat Terhapus",
      sets: log.jumlah_set,
      reps: log.jumlah_repetisi,
      date: dateStr,
      time: timeStr,
    };
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />

          <div className="flex items-center justify-between mb-6 mt-2">
            <h1 className="text-2xl font-extrabold text-[#1a2332]">
              Daftar Latihan
            </h1>
            <Link
              href="/log/add"
              className="flex items-center gap-1.5 text-brand-teal font-bold bg-brand-teal-light px-3 py-1.5 rounded-full hover:bg-[#c9f2eb] transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              <span className="text-sm">Tambah</span>
            </Link>
          </div>

          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="text-center py-12 bg-field-bg rounded-3xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500 font-semibold mb-1">Belum ada latihan dicatat</p>
                <p className="text-xs text-gray-400">Silakan catat latihan harian Anda.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between bg-white border border-[#eef2f6] rounded-[24px] p-5 shadow-sm"
                >
                  <div>
                    <h3 className="font-bold text-gray-900 text-[17px] mb-1">
                      {log.name}
                    </h3>
                    <p className="text-gray-500 text-[13px] mb-2">
                      {log.sets} Sets • {log.reps} Reps
                    </p>
                    <p className="text-[11px] font-semibold text-brand-teal">
                      {log.date} - {log.time}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-[#dbf5ef] rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2
                      className="w-6 h-6 text-brand-teal"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <BottomNav activeTab="log" />
      </div>
    </div>
  );
}
