import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Komponen UI Statis
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BottomNav from "../components/dashboard/BottomNav";

// Komponen UI Dinamis (Dipindahkan ke DashboardContent)
import Greeting from "../components/dashboard/Greeting";
import StatsOverview from "../components/dashboard/StatsOverview";
import RecentActivity from "../components/dashboard/RecentActivity";

// Komponen Skeleton Baru
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";

interface JwtPayload {
  userId: number;
  email: string;
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // Proteksi Halaman Instan (Tanpa nunggu query DB)
  if (!token) {
    redirect("/login");
  }

  let userId: number;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");
    const decoded = jwt.verify(token, secret) as JwtPayload;
    userId = decoded.userId;
  } catch (error) {
    console.error("JWT verification failed:", error);
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          {/* Header langsung muncul tanpa nunggu data */}
          <DashboardHeader />

          {/* Bungkus bagian database dengan Suspense */}
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent userId={userId} />
          </Suspense>
        </div>

        {/* Navigasi bawah langsung muncul */}
        <BottomNav activeTab="home" />
      </div>
    </div>
  );
}

// Sub-komponen khusus untuk menangani data fetching yang berat
async function DashboardContent({ userId }: { userId: number }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  if (!user) {
    redirect("/login");
  }

  const firstName = user.name ? user.name.trim().split(/\s+/)[0] : "User";

  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startOfWeek = new Date(today.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const [workoutsThisWeek, setsAgg, recentLogs] = await Promise.all([
    prisma.logLatihan.count({
      where: {
        user_id: userId,
        tanggal_latihan: { gte: startOfWeek },
      },
    }),
    prisma.logLatihan.aggregate({
      where: { user_id: userId },
      _sum: { jumlah_set: true },
    }),
    prisma.logLatihan.findMany({
      where: { user_id: userId },
      take: 3,
      orderBy: { tanggal_latihan: "desc" },
      include: {
        alat: {
          select: { nama_alat: true, foto_path: true },
        },
      },
    }),
  ]);

  const totalSets = setsAgg._sum.jumlah_set || 0;

  const activities = recentLogs.map((log) => {
    const isCardio = /treadmill|run|sepeda|cardio|sprint|walking|jalan/i.test(
      log.alat?.nama_alat || "",
    );
    return {
      id: log.id,
      title: log.alat?.nama_alat || "Alat Terhapus",
      subtitle: `${log.jumlah_set} Sets • ${log.jumlah_repetisi} Reps`,
      category: isCardio ? "CARDIO" : "STRENGTH",
      categoryColor: isCardio ? "text-[#628fdb]" : "text-[#d9657b]",
      categoryBg: isCardio ? "bg-[#eef4ff]" : "bg-[#fcebef]",
      image:
        log.alat?.foto_path ||
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop",
    };
  });

  return (
    <>
      <Greeting name={firstName} />
      <StatsOverview
        workoutsThisWeek={workoutsThisWeek}
        totalSets={totalSets}
      />
      <RecentActivity activities={activities} />
    </>
  );
}
