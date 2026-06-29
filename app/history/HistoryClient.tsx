"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Check,
  Loader2,
} from "lucide-react";

interface Alat {
  id: number;
  nama_alat: string;
  foto_path: string;
}

interface LogLatihan {
  id: number;
  jumlah_set: number;
  jumlah_repetisi: number;
  berat_alat: number | null;
  catatan_latihan: string | null;
  tanggal_latihan: string;
  alat?: Alat;
}

export default function HistoryClient() {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // States
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [monthlyLogs, setMonthlyLogs] = useState<LogLatihan[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch monthly logs whenever currentMonth changes
  useEffect(() => {
    const fetchMonthlyLogs = async () => {
      setLoading(true);
      try {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
        const res = await fetch(`/api/log-latihan?bulan=${year}-${month}`);
        if (res.ok) {
          const json = await res.json();
          setMonthlyLogs(json.data || []);
        }
      } catch (err) {
        console.error("Error fetching logs for month:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyLogs();
  }, [currentMonth]);

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  // Generate calendar grid cells
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Day index of 1st day of month (0 = Sun, 1 = Mon...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in current month
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells = [];
  // Pad previous month days
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ date: null });
  }
  // Add days in this month
  for (let day = 1; day <= totalDays; day++) {
    // Check if any workouts exist on this day in monthlyLogs
    const hasWorkout = monthlyLogs.some((log) => {
      const logDate = new Date(log.tanggal_latihan);
      return (
        logDate.getDate() === day &&
        logDate.getMonth() === month &&
        logDate.getFullYear() === year
      );
    });

    const isActive =
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year;

    cells.push({
      date: day,
      hasDot: hasWorkout,
      isActive,
    });
  }

  // Split cells into rows of 7
  const calendarRows: {
    date: number | null;
    hasDot?: boolean;
    isActive?: boolean;
  }[][] = [];
  let currentRow: (typeof calendarRows)[number] = [];

  cells.forEach((cell, index) => {
    currentRow.push(cell);
    if (currentRow.length === 7 || index === cells.length - 1) {
      while (currentRow.length < 7) {
        currentRow.push({ date: null });
      }
      calendarRows.push(currentRow);
      currentRow = [];
    }
  });

  // Filter logs for selected day
  const selectedDayLogs = monthlyLogs.filter((log) => {
    const logDate = new Date(log.tanggal_latihan);
    return (
      logDate.getDate() === selectedDate.getDate() &&
      logDate.getMonth() === selectedDate.getMonth() &&
      logDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Format month and year display
  const monthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  // Format selected day display
  const selectedDateHeader =
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
    }).format(selectedDate) + " Workouts";

  const handleSelectDay = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  return (
    <>
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
          <button
            type="button"
            onClick={prevMonth}
            className="text-gray-600 hover:text-black cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h2 className="text-[17px] font-bold text-[#0f172a] capitalize">
            {monthName}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="text-gray-600 hover:text-black cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-5 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px] z-10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-brand-teal animate-spin" />
            </div>
          )}

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
                  <button
                    type="button"
                    onClick={() => handleSelectDay(cell.date!)}
                    className="relative flex flex-col items-center cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`w-[28px] h-[28px] flex items-center justify-center rounded-full text-[14px] transition-all ${cell.isActive ? "bg-[#fef0b9] font-bold text-black scale-110" : "text-[#334155] hover:bg-gray-100"}`}
                    >
                      {cell.date}
                    </div>
                    {cell.hasDot && (
                      <div className="w-[4px] h-[4px] bg-brand-teal rounded-full absolute -bottom-2" />
                    )}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            )),
          )}

          {/* Ellipsis Row to match aesthetic */}
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={`ellipsis-${i}`}
              className="text-center text-[#cbd5e1] text-[10px] tracking-widest mt-1 select-none"
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
          {selectedDateHeader}
        </h3>
      </div>

      {/* Workout Cards */}
      <div className="space-y-4">
        {selectedDayLogs.length === 0 ? (
          <div className="text-center py-12 bg-field-bg rounded-3xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-1">
              Tidak ada latihan
            </p>
            <p className="text-xs text-gray-400">
              Tidak ada riwayat latihan yang dicatat pada hari ini.
            </p>
          </div>
        ) : (
          selectedDayLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white border border-[#eef2f6] rounded-[24px] p-4 shadow-sm flex items-start gap-4 relative"
            >
              <div className="w-[72px] h-[72px] rounded-[16px] overflow-hidden shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    log.alat?.foto_path ||
                    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop"
                  }
                  alt={log.alat?.nama_alat || "Alat"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 pt-1 pr-8">
                <h4 className="font-bold text-[#0f172a] text-[17px] mb-2">
                  {log.alat?.nama_alat || "Alat Terhapus"}
                </h4>
                <div className="flex gap-2 mb-2">
                  <span className="bg-[#ccfbf1] text-[#0f766e] px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide">
                    {log.jumlah_set} Sets
                  </span>
                  <span className="bg-[#e0e7ff] text-[#4f46e5] px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide">
                    {log.jumlah_repetisi} Reps
                  </span>
                  {log.berat_alat !== null && log.berat_alat !== undefined && (
                    <span className="bg-[#fef3c7] text-[#b45309] px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide">
                      {log.berat_alat} kg
                    </span>
                  )}
                </div>
                {log.catatan_latihan && (
                  <p className="text-[12px] text-gray-500 leading-[1.4] font-medium">
                    {log.catatan_latihan}
                  </p>
                )}
              </div>
              <div className="absolute top-5 right-5 w-7 h-7 bg-[#ccfbf1] rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-[#0d9488]" strokeWidth={4} />
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
