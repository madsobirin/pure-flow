import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import BottomNav from "../../components/dashboard/BottomNav";
import Link from "next/link";
import { Plus } from "lucide-react";

interface JwtPayload {
  userId: number;
  email: string;
}

export default async function EquipmentListPage() {
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
    console.error("JWT verification failed in equipment page:", error);
    redirect("/login");
  }

  const equipments = await prisma.alat.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />

          <div className="flex items-center justify-between mb-6 mt-2">
            <h1 className="text-2xl font-extrabold text-[#1a2332]">
              Daftar Alat
            </h1>
            <Link
              href="/equipment/add"
              className="flex items-center gap-1.5 text-brand-teal font-bold bg-brand-teal-light px-3 py-1.5 rounded-full hover:bg-[#c9f2eb] transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              <span className="text-sm">Tambah</span>
            </Link>
          </div>

          <div className="space-y-4">
            {equipments.length === 0 ? (
              <div className="text-center py-12 bg-field-bg rounded-3xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-500 font-semibold mb-1">Belum ada alat terdaftar</p>
                <p className="text-xs text-gray-400">Silakan tambahkan alat latihan pertama Anda.</p>
              </div>
            ) : (
              equipments.map((eq) => (
                <div
                  key={eq.id}
                  className="flex items-center gap-4 bg-white border border-[#eef2f6] rounded-[24px] p-4 shadow-sm"
                >
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={eq.foto_path}
                      alt={eq.nama_alat}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-[17px] mb-1">
                      {eq.nama_alat}
                    </h3>
                    <p className="text-gray-500 text-[13px] leading-tight line-clamp-2">
                      {eq.catatan_alat || "-"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <BottomNav activeTab="equipment" />
      </div>
    </div>
  );
}
