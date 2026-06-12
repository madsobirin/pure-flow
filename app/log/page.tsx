import DashboardHeader from "../../components/dashboard/DashboardHeader";
import BottomNav from "../../components/dashboard/BottomNav";
import Link from "next/link";
import { Plus, CheckCircle2 } from "lucide-react";

export default function LogListPage() {
  const logs = [
    {
      id: 1,
      name: "Dumbbell Press",
      sets: 4,
      reps: 12,
      date: "Kamis, 11 Jun 2026",
      time: "03.40",
    },
    {
      id: 2,
      name: "Treadmill Run",
      sets: 1,
      reps: 1,
      date: "Rabu, 10 Jun 2026",
      time: "16.20",
    },
  ];

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
              className="flex items-center gap-1.5 text-brand-teal font-bold bg-[#e6f0ef] px-3 py-1.5 rounded-full hover:bg-[#c9f2eb] transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              <span className="text-sm">Tambah</span>
            </Link>
          </div>

          <div className="space-y-4">
            {logs.map((log) => (
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
            ))}
          </div>
        </div>

        <BottomNav activeTab="log" />
      </div>
    </div>
  );
}
