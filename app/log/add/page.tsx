import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import BottomNav from "../../../components/dashboard/BottomNav";
import AddLogForm from "./AddLogForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface JwtPayload {
  userId: number;
  email: string;
}

export default async function AddLogPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // Protect page
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
    console.error("JWT verification failed in add log page:", error);
    redirect("/login");
  }

  // Fetch list of equipment available for the user to select in form dropdown
  const equipments = await prisma.alat.findMany({
    where: { user_id: userId },
    select: {
      id: true,
      nama_alat: true,
    },
    orderBy: { nama_alat: "asc" },
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 pb-28">
          <DashboardHeader />
          <AddLogForm equipments={equipments} />
        </div>

        <BottomNav activeTab="log" />
      </div>
    </div>
  );
}
