"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2, CheckCircle2 } from "lucide-react";

interface Alat {
  id: number | string;
  nama_alat: string;
  foto_path: string;
  catatan_alat: string | null;
  isUploading?: boolean;
}

interface EquipmentListClientProps {
  initialData?: Alat[];
}

export default function EquipmentListClient({
  initialData = [],
}: EquipmentListClientProps) {
  const [equipments, setEquipments] = useState<Alat[]>(initialData);
  const [uploadingItems, setUploadingItems] = useState<Alat[]>([]);
  const [loading, setLoading] = useState(initialData.length === 0);

  const fetchEquipments = async () => {
    try {
      const res = await fetch("/api/alat");
      if (res.ok) {
        const json = await res.json();
        setEquipments(json.data || []);
      }
    } catch (err) {
      console.error("Error fetching equipments:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUploadingItems = () => {
    if (typeof window !== "undefined") {
      const items = JSON.parse(
        localStorage.getItem("uploading_equipments") || "[]",
      );
      setUploadingItems(items);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchEquipments();
      loadUploadingItems();
    });

    const handleUpdated = () => {
      fetchEquipments();
      loadUploadingItems();
    };

    window.addEventListener("equipment-updated", handleUpdated);
    window.addEventListener("storage", loadUploadingItems);

    return () => {
      window.removeEventListener("equipment-updated", handleUpdated);
      window.removeEventListener("storage", loadUploadingItems);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-6 mt-2">
        <h1 className="text-2xl font-extrabold text-[#1a2332]">Daftar Alat</h1>
        <Link
          href="/equipment/add"
          className="flex items-center gap-1.5 text-brand-teal font-bold bg-brand-teal-light px-3 py-1.5 rounded-full hover:bg-[#c9f2eb] transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          <span className="text-sm">Tambah</span>
        </Link>
      </div>

      <div className="space-y-4">
        {/* State 1: Loading Pertama Kali (Skeleton) */}
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-[24px] bg-white animate-pulse"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : uploadingItems.length === 0 && equipments.length === 0 ? (
          /* State 2: Kosong */
          <div className="text-center py-12 bg-field-bg rounded-3xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500 font-semibold mb-1">
              Belum ada alat terdaftar
            </p>
            <p className="text-xs text-gray-400">
              Silakan tambahkan alat latihan pertama Anda.
            </p>
          </div>
        ) : (
          /* State 3: Menampilkan Data */
          <>
            {/* Item yang sedang diunggah secara optimistis */}
            {uploadingItems.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center justify-between gap-4 bg-white border border-[#eef2f6] rounded-[24px] p-4 shadow-sm opacity-60 animate-pulse"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={eq.foto_path}
                      alt={eq.nama_alat}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-brand-teal animate-spin" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-[17px] leading-tight">
                        {eq.nama_alat}
                      </h3>
                      <span className="bg-[#ccfbf1] text-[#0f766e] px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide flex items-center gap-1">
                        Mengunggah...
                      </span>
                    </div>
                    <p className="text-gray-500 text-[13px] leading-tight line-clamp-2">
                      {eq.catatan_alat || "-"}
                    </p>
                  </div>
                </div>
                {/* Loader khusus saat sedang mengunggah */}
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center shrink-0">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              </div>
            ))}

            {/* Item riil dari database */}
            {equipments.map((eq) => (
              <Link
                href={`/equipment/${eq.id}`}
                key={eq.id}
                className="flex items-center justify-between gap-4 bg-white border border-[#eef2f6] rounded-[24px] p-4 shadow-sm hover:border-gray-200 transition-all active:scale-[0.99] cursor-pointer "
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={eq.foto_path}
                      alt={eq.nama_alat}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-[17px] mb-1">
                      {eq.nama_alat}
                    </h3>
                    <p className="text-gray-500 text-[13px] leading-tight line-clamp-2">
                      {eq.catatan_alat || "-"}
                    </p>
                  </div>
                </div>

                {/* Tambahan checkmark lingkaran hijau di sisi kanan */}
                <div className="w-10 h-10 bg-[#dbf5ef] rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2
                    className="w-6 h-6 text-brand-teal"
                    strokeWidth={2.5}
                  />
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </>
  );
}
