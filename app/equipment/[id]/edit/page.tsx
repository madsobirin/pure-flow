import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import DashboardHeader from "../../../../components/dashboard/DashboardHeader";
import BottomNav from "../../../../components/dashboard/BottomNav";
import EditEquipmentForm from "./EditEquipmentForm";

interface JwtPayload {
  userId: number;
  email: string;
}

export default async function EditEquipmentPage({
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
    console.error("JWT verification failed in equipment edit page:", error);
    redirect("/login");
  }

  const { id } = await params;
  const alatId = parseInt(id);
  if (isNaN(alatId)) {
    notFound();
  }

  const alat = await prisma.alat.findFirst({
    where: { id: alatId, user_id: userId },
  });

  if (!alat) {
    notFound();
  }

  const formattedAlat = {
    id: alat.id,
    nama_alat: alat.nama_alat,
    foto_path: alat.foto_path,
    catatan_alat: alat.catatan_alat,
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />
          <EditEquipmentForm alat={formattedAlat} />
        </div>

        <BottomNav activeTab="equipment" />
      </div>
    </div>
  );
}
