import DashboardHeader from "../../components/dashboard/DashboardHeader";
import BottomNav from "../../components/dashboard/BottomNav";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
} from "lucide-react";

export default function HistoryPage() {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  type CalendarCell = {
    date: number | null;
    hasDot?: boolean;
    isActive?: boolean;
  };

  // Custom dummy data to perfectly match the screenshot's exact arrangement
  const calendarRows: CalendarCell[][] = [
    [
      { date: null },
      { date: null },
      { date: 1 },
      { date: 2, hasDot: true },
      { date: 3 },
      { date: 4, hasDot: true },
      { date: 5 },
    ],
    [
      { date: 6 },
      { date: 7, hasDot: true },
      { date: 8 },
      { date: 9 },
      { date: 10, hasDot: true },
      { date: 11 },
      { date: 12 },
    ],
    [
      { date: 13, hasDot: true },
      { date: 14 },
      { date: 15, hasDot: true, isActive: true },
      { date: 16 },
      { date: 17 },
      { date: 18 },
      { date: 19 },
    ],
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />

          <div className="mb-6 mt-1">
            <h1 className="text-[22px] font-extrabold text-[#0f172a] mb-0.5 tracking-tight">
              History Tracker
            </h1>
            <p className="text-[13px] text-gray-500 font-medium">
              Review your workout journey.
            </p>
          </div>

          {/* Calendar Card */}
          <div className="bg-white border border-[#eef2f6] rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] mb-8">
            <div className="flex items-center justify-between mb-8 px-2">
              <button className="text-gray-600 hover:text-black">
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <h2 className="text-[17px] font-bold text-[#0f172a]">
                October 2023
              </h2>
              <button className="text-gray-600 hover:text-black">
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-5">
              {/* Days Header */}
              {daysOfWeek.map((day, i) => (
                <div
                  key={`header-${i}`}
                  className="text-center text-[10px] font-extrabold text-[#475569]"
                >
                  {day}
                </div>
              ))}

              {/* Dates Grid */}
              {calendarRows.map((row, rowIndex) =>
                row.map((cell, cellIndex) => (
                  <div
                    key={`cell-${rowIndex}-${cellIndex}`}
                    className="flex flex-col items-center justify-start h-8"
                  >
                    {cell.date ? (
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-[28px] h-[28px] flex items-center justify-center rounded-full text-[14px] ${cell.isActive ? "bg-[#fef0b9] font-bold text-black" : "text-[#334155]"}`}
                        >
                          {cell.date}
                        </div>
                        {cell.hasDot && (
                          <div className="w-[4px] h-[4px] bg-brand-teal rounded-full absolute -bottom-2" />
                        )}
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                )),
              )}

              {/* Ellipsis Row */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={`ellipsis-${i}`}
                  className="text-center text-[#cbd5e1] text-[10px] tracking-widest mt-1"
                >
                  ...
                </div>
              ))}
            </div>
          </div>

          {/* Selected Date Header */}
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon
              className="w-[22px] h-[22px] text-brand-teal"
              strokeWidth={2.5}
            />
            <h3 className="text-[17px] font-bold text-[#0f172a]">
              Oct 15 Workouts
            </h3>
          </div>

          {/* Workout Cards */}
          <div className="space-y-4">
            {/* Dumbbell Press */}
            <div className="bg-white border border-[#eef2f6] rounded-[24px] p-4 shadow-sm flex items-start gap-4 relative">
              <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop"
                  alt="Dumbbell Press"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 pt-1 pr-8">
                <h4 className="font-bold text-[#0f172a] text-[17px] mb-2">
                  Dumbbell Press
                </h4>
                <div className="flex gap-2 mb-2">
                  <span className="bg-[#ccfbf1] text-[#0f766e] px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide">
                    4 Sets
                  </span>
                  <span className="bg-[#e0e7ff] text-[#4f46e5] px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide">
                    12 Reps
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 leading-[1.4] font-medium">
                  Felt good, might increase weight next time.
                </p>
              </div>
              <div className="absolute top-5 right-5 w-7 h-7 bg-[#ccfbf1] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-[#0d9488]" strokeWidth={4} />
              </div>
            </div>

            {/* Treadmill Sprint */}
            <div className="bg-white border border-[#eef2f6] rounded-[24px] p-4 shadow-sm flex items-start gap-4 relative">
              <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop"
                  alt="Treadmill Sprint"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 pt-1 pr-8">
                <h4 className="font-bold text-[#0f172a] text-[17px] mb-2">
                  Treadmill Sprint
                </h4>
                <div className="flex gap-2 mb-2">
                  <span className="bg-[#fce7f3] text-[#be185d] px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide">
                    1 Set
                  </span>
                  <span className="bg-[#e0e7ff] text-[#3730a3] px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide">
                    20 Mins
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 leading-[1.4] font-medium">
                  Intense cardio session.
                </p>
              </div>
              <div className="absolute top-5 right-5 w-7 h-7 bg-[#ccfbf1] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-[#0d9488]" strokeWidth={4} />
              </div>
            </div>
          </div>
        </div>

        <BottomNav activeTab="history" />
      </div>
    </div>
  );
}
