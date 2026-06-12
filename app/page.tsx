import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Greeting from "../components/dashboard/Greeting";
import StatsOverview from "../components/dashboard/StatsOverview";
import RecentActivity from "../components/dashboard/RecentActivity";
import BottomNav from "../components/dashboard/BottomNav";

interface JwtPayload {
  userId: number;
  email: string;
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // Protect page: if no token, redirect to login
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
    console.error("JWT verification failed in homepage:", error);
    redirect("/login");
  }

  // Fetch user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  if (!user) {
    redirect("/login");
  }

  // Get user's first name
  const firstName = user.name ? user.name.trim().split(/\s+/)[0] : "User";

  // Calculate workouts logged this week (from Monday 00:00:00 UTC/Local)
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon ...
  // Calculate difference to get Monday of this week
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const startOfWeek = new Date(today.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);

  const workoutsThisWeek = await prisma.logLatihan.count({
    where: {
      user_id: userId,
      tanggal_latihan: {
        gte: startOfWeek,
      },
    },
  });

  // Calculate total sets logged
  const setsAgg = await prisma.logLatihan.aggregate({
    where: { user_id: userId },
    _sum: {
      jumlah_set: true,
    },
  });
  const totalSets = setsAgg._sum.jumlah_set || 0;

  // Fetch recent 3 logged activities
  const recentLogs = await prisma.logLatihan.findMany({
    where: { user_id: userId },
    take: 3,
    orderBy: { tanggal_latihan: "desc" },
    include: {
      alat: {
        select: {
          nama_alat: true,
          foto_path: true,
        },
      },
    },
  });

  // Map to activities format matching the component UI
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
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      {/* Mobile container - centered on desktop */}
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        {/* Main scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />
          <Greeting name={firstName} />
          <StatsOverview
            workoutsThisWeek={workoutsThisWeek}
            totalSets={totalSets}
          />
          {/* <LogButton /> */}
          <RecentActivity activities={activities} />
        </div>

        {/* Fixed bottom navigation */}
        <BottomNav activeTab="home" />
      </div>
    </div>
  );
}
