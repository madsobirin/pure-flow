"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  Plus,
  Minus,
  Check,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

interface EquipmentOption {
  id: number;
  nama_alat: string;
}

interface AddLogFormProps {
  equipments: EquipmentOption[];
}

export default function AddLogForm({ equipments }: AddLogFormProps) {
  const router = useRouter();

  // Date and Time display
  const [currentDateStr, setCurrentDateStr] = useState("Memuat tanggal...");
  const [currentTimeStr, setCurrentTimeStr] = useState("Memuat waktu...");

  // Form states
  const [alatId, setAlatId] = useState("");
  const [sets, setSets] = useState(1);
  const [reps, setReps] = useState(1);
  const [catatanLatihan, setCatatanLatihan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Update date and time on client mount
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric",
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };

      try {
        setCurrentDateStr(new Intl.DateTimeFormat("id-ID", dateOptions).format(now));
        setCurrentTimeStr(new Intl.DateTimeFormat("id-ID", timeOptions).format(now).replace(":", "."));
      } catch {
        // Fallback
        setCurrentDateStr(now.toLocaleDateString("id-ID"));
        setCurrentTimeStr(now.toLocaleTimeString("id-ID").substring(0, 5));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const adjustSets = (amount: number) => {
    setSets((prev) => Math.max(1, prev + amount));
  };

  const adjustReps = (amount: number) => {
    setReps((prev) => Math.max(1, prev + amount));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alatId) {
      setError("Silakan pilih alat latihan terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/log-latihan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alat_id: Number(alatId),
          jumlah_set: sets,
          jumlah_repetisi: reps,
          catatan_latihan: catatanLatihan.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/log");
        router.refresh();
      } else {
        setError(result.message || "Gagal menyimpan log latihan.");
      }
    } catch (err) {
      console.error("Add log error:", err);
      setError("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-start justify-between mb-1 mt-2">
        <div className="flex items-center gap-3">
          <Link
            href="/log"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          </Link>
          <h1 className="text-[20px] font-extrabold text-[#1a2332] leading-tight">
            Tambah latihan
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-gray-500 mb-0.5 font-medium tracking-tight">
            {currentDateStr}
          </p>
          <p className="text-[13px] font-extrabold text-brand-teal">
            {currentTimeStr}
          </p>
        </div>
      </div>

      <p className="text-[13px] text-gray-400 mb-6 font-medium ml-13">
        Catat progres harianmu untuk hasil maksimal.
      </p>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-2xl text-xs flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="border border-[#eef2f6] rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] mb-6 bg-white">
        {/* Pilih Alat */}
        <div className="mb-6">
          <label className="block text-[10px] font-extrabold text-[#1a2332] tracking-widest uppercase mb-2">
            PILIH ALAT
          </label>
          <div className="relative">
            <select
              value={alatId}
              onChange={(e) => {
                setAlatId(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-field-bg border-none rounded-[16px] px-5 py-4 text-[14px] text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium pr-10 cursor-pointer"
              disabled={isLoading}
            >
              <option value="" disabled>
                Pilih alat dari daftar...
              </option>
              {equipments.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nama_alat}
                </option>
              ))}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          {equipments.length === 0 && (
            <p className="text-xs text-orange-600 font-semibold mt-2 ml-1">
              Anda belum menambahkan alat. Silakan tambah alat terlebih dahulu di menu{" "}
              <Link href="/equipment/add" className="underline hover:text-brand-teal">
                Equipment
              </Link>
              .
            </p>
          )}
        </div>

        {/* Set & Reps counters */}
        <div className="flex gap-4 mb-6">
          {/* Sets */}
          <div className="flex-1">
            <label className="block text-[10px] font-extrabold text-[#1a2332] tracking-widest uppercase mb-2">
              JUMLAH SET
            </label>
            <div className="flex items-stretch h-[54px] bg-field-bg rounded-[16px] overflow-hidden border border-transparent focus-within:border-brand-teal/20 transition-all">
              <div className="flex-1 flex items-center justify-center border-r border-[#eef2f6]">
                <span className="text-[20px] text-gray-800 font-extrabold leading-none">
                  {sets}
                </span>
              </div>
              <div className="flex flex-col w-[38px] shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => adjustSets(1)}
                  className="flex-1 flex items-center justify-center border-b border-[#e8eaec] bg-field-bg hover:bg-white transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  <Plus className="w-3.5 h-3.5 text-brand-teal" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => adjustSets(-1)}
                  className="flex-1 flex items-center justify-center bg-field-bg hover:bg-white transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  <Minus className="w-3.5 h-3.5 text-brand-teal" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Reps */}
          <div className="flex-1">
            <label className="block text-[10px] font-extrabold text-[#1a2332] tracking-widest uppercase mb-2">
              JUMLAH REPETISI
            </label>
            <div className="flex items-stretch h-[54px] bg-field-bg rounded-[16px] overflow-hidden border border-transparent focus-within:border-brand-teal/20 transition-all">
              <div className="flex-1 flex items-center justify-center border-r border-[#eef2f6]">
                <span className="text-[20px] text-gray-800 font-extrabold leading-none">
                  {reps}
                </span>
              </div>
              <div className="flex flex-col w-[38px] shrink-0 bg-white">
                <button
                  type="button"
                  onClick={() => adjustReps(1)}
                  className="flex-1 flex items-center justify-center border-b border-[#e8eaec] bg-field-bg hover:bg-white transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  <Plus className="w-3.5 h-3.5 text-brand-teal" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => adjustReps(-1)}
                  className="flex-1 flex items-center justify-center bg-field-bg hover:bg-white transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  <Minus className="w-3.5 h-3.5 text-brand-teal" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Latihan */}
        <div className="mb-8">
          <label className="block text-[10px] font-extrabold text-[#1a2332] tracking-widest uppercase mb-2">
            CATATAN LATIHAN{" "}
            <span className="text-[#a8b0ba] font-medium lowercase tracking-normal">
              (opsional)
            </span>
          </label>
          <textarea
            placeholder="Bagaimana rasanya set terakhir?"
            value={catatanLatihan}
            onChange={(e) => setCatatanLatihan(e.target.value)}
            rows={4}
            className="w-full bg-field-bg border-none rounded-[16px] p-5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isLoading || equipments.length === 0}
          className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-full py-4 flex items-center justify-center gap-2.5 font-bold text-[16px] shadow-[0_8px_20px_rgba(0,103,91,0.25)] transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-brand-teal" strokeWidth={4} />
              </div>
              <span>Simpan Latihan</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-[#ccd2d8] font-medium mt-4">
          Log ini akan disimpan dengan timestamp saat ini.
        </p>
      </div>
    </form>
  );
}
