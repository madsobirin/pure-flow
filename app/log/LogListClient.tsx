"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, CheckCircle2 } from "lucide-react";
import { formatLocalDate, formatLocalTime } from "@/lib/date";
import { FiSearch } from "react-icons/fi";

// 1. Tipe data hasil format untuk State UI
interface LogType {
  id: number;
  name: string;
  sets: number;
  reps: number;
  berat_alat: number | null;
  date: string;
  time: string;
}

// 2. Tipe data mentah dari API / Prisma backend
interface RawLogType {
  id: number;
  tanggal_latihan: string; // atau Date jika berupa ISO string
  jumlah_set: number;
  jumlah_repetisi: number;
  berat_alat: number | null;
  alat?: {
    nama_alat: string;
  } | null;
}

interface LogListClientProps {
  initialLogs?: LogType[];
}

export default function LogListClient({
  initialLogs = [],
}: LogListClientProps) {
  const [logs, setLogs] = useState<LogType[]>(initialLogs);
  const [loading, setLoading] = useState(initialLogs.length === 0);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLogs = logs.filter((log) =>
    log.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (initialLogs.length === 0) {
      const fetchLogs = async () => {
        try {
          const res = await fetch("/api/log-latihan");
          if (res.ok) {
            // Cast response json agar strukturnya jelas
            const json = (await res.json()) as { data: RawLogType[] };

            // Menghapus 'any' dan menggantinya dengan 'RawLogType'
            const formatted = (json.data || []).map(
              (log: RawLogType): LogType => {
                return {
                  id: log.id,
                  name: log.alat?.nama_alat || "Alat Terhapus",
                  sets: log.jumlah_set,
                  reps: log.jumlah_repetisi,
                  berat_alat: log.berat_alat,
                  date: formatLocalDate(log.tanggal_latihan),
                  time: formatLocalTime(log.tanggal_latihan),
                };
              },
            );

            setLogs(formatted);
          }
        } catch (err) {
          console.error("Error fetching logs:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchLogs();
    }
  }, [initialLogs]);

  return (
    <>
      <div className="flex items-center justify-between mb-6 mt-2">
        <h1 className="text-2xl font-extrabold text-[#1a2332]">
          Daftar Latihan
        </h1>

        <Link
          href="/log/add"
          className="flex items-center gap-1.5 text-brand-teal font-bold bg-brand-teal-light px-3 py-1.5 rounded-full hover:bg-[#c9f2eb] transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          <span className="text-sm">Tambah</span>
        </Link>
      </div>

      <div className="relative mb-6">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          type="search"
          placeholder="Cari latihan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="
          h-12
          w-full
          rounded-full
          border border-slate-200
          bg-white
          pl-11
          pr-4
          text-sm
          shadow-sm
          transition
          placeholder:text-slate-400
          focus:border-[#0B7A75]
          focus:ring-2
          focus:ring-[#0B7A75]/20
          focus:outline-none
        "
        />
      </div>
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm animate-pulse"
            >
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full shrink-0" />
            </div>
          ))
        ) : logs.length === 0 ? (
          <div className="text-center py-12 bg-field-bg rounded-3xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-1">
              Belum ada latihan dicatat
            </p>
            <p className="text-xs text-gray-400">
              Silakan catat latihan harian Anda.
            </p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-field-bg rounded-3xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-1">
              Latihan tidak ditemukan
            </p>
            <p className="text-xs text-gray-400">
              Coba kata kunci pencarian yang lain.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <Link
              href={`/log/${log.id}`}
              key={log.id}
              className="flex items-center justify-between bg-white border border-[#eef2f6] rounded-[24px] p-5 shadow-sm hover:border-gray-200 transition-all active:scale-[0.99] cursor-pointer"
            >
              <div>
                <h3 className="font-bold text-gray-900 text-[17px] mb-1">
                  {log.name}
                </h3>
                <p className="text-gray-500 text-[13px] mb-2">
                  {log.sets} Sets • {log.reps} Reps
                  {log.berat_alat !== null &&
                    log.berat_alat !== undefined &&
                    ` • ${log.berat_alat} kg`}
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
            </Link>
          ))
        )}
      </div>
    </>
  );
}
