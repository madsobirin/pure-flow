import { Dumbbell, Flame } from "lucide-react";

interface StatsOverviewProps {
  workoutsThisWeek: number;
  totalSets: number;
}

export default function StatsOverview({ workoutsThisWeek, totalSets }: StatsOverviewProps) {
  return (
    <div className="flex gap-4 mb-6">
      {/* Workouts Card */}
      <div className="flex-1 bg-white border border-[#eef2f6] rounded-3xl p-5 flex flex-col items-center shadow-sm relative overflow-hidden">
        <div className="w-12 h-12 bg-[#c9f2eb] rounded-full flex items-center justify-center mb-3">
          <Dumbbell className="w-6 h-6 text-brand-teal" strokeWidth={2} />
        </div>
        <div className="text-[40px] font-extrabold text-brand-teal leading-none mb-2">
          {workoutsThisWeek}
        </div>
        <div className="text-[10px] font-bold tracking-widest text-gray-700 uppercase mb-1">
          Workouts
        </div>
        <div className="text-xs text-gray-400 font-medium">This Week</div>
      </div>

      {/* Total Sets Card */}
      <div className="flex-1 bg-white border border-[#eef2f6] rounded-3xl p-5 flex flex-col items-center shadow-sm relative overflow-hidden">
        <div className="w-12 h-12 bg-[#fef0b9] rounded-full flex items-center justify-center mb-3 relative z-10">
          <Flame className="w-6 h-6 text-[#9a781b]" strokeWidth={2} />
        </div>
        <div className="text-[40px] font-extrabold text-[#1a2332] leading-none mb-2 relative z-10">
          {totalSets}
        </div>
        <div className="text-[10px] font-bold tracking-widest text-gray-700 uppercase mb-1 relative z-10">
          Total Sets
        </div>
        <div className="text-xs text-gray-400 font-medium relative z-10">Logged</div>
        
        {/* Decorative Arc */}
        <div className="absolute -bottom-4 -right-4 w-16 h-16 border-[6px] border-[#e6f2f0] rounded-full z-0"></div>
      </div>
    </div>
  );
}
