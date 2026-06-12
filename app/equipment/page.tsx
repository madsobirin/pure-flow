import DashboardHeader from "../../components/dashboard/DashboardHeader";
import BottomNav from "../../components/dashboard/BottomNav";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function EquipmentListPage() {
  const equipments = [
    {
      id: 1,
      name: "Dumbbell 5kg",
      notes: "Digunakan untuk latihan upper body",
      image:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Treadmill",
      notes: "Beban maksimal 100kg",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop",
    },
  ];

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
              className="flex items-center gap-1.5 text-brand-teal font-bold bg-[#e6f0ef] px-3 py-1.5 rounded-full hover:bg-[#c9f2eb] transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              <span className="text-sm">Tambah</span>
            </Link>
          </div>

          <div className="space-y-4">
            {equipments.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center gap-4 bg-white border border-[#eef2f6] rounded-[24px] p-4 shadow-sm"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={eq.image}
                    alt={eq.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[17px] mb-1">
                    {eq.name}
                  </h3>
                  <p className="text-gray-500 text-[13px] leading-tight line-clamp-2">
                    {eq.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <BottomNav activeTab="equipment" />
      </div>
    </div>
  );
}
