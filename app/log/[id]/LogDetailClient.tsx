"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit3, Trash2, Calendar, Clock, ClipboardList } from "lucide-react";
import ConfirmModal from "../../../components/dashboard/ConfirmModal";
import SuccessOverlay from "../../../components/dashboard/SuccessOverlay";
import { AnimatePresence } from "motion/react";

interface AlatType {
  id: number;
  nama_alat: string;
  foto_path: string;
}

interface LogClientType {
  id: number;
  jumlah_set: number;
  jumlah_repetisi: number;
  catatan_latihan: string | null;
  tanggal_latihan: string;
  formattedDate: string;
  formattedTime: string;
  alat: AlatType | null;
}

interface LogDetailClientProps {
  log: LogClientType;
}

export default function LogDetailClient({ log }: LogDetailClientProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/log/${log.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleteModalOpen(false);
        setShowSuccessOverlay(true);

        // Delay 1500ms agar user bisa melihat animasi sukses
        setTimeout(() => {
          router.push("/log");
          router.refresh();
        }, 1500);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Gagal menghapus catatan latihan.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Delete log error:", err);
      alert("Terjadi kesalahan koneksi server.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Tombol Back */}
      <div className="flex items-center gap-4 mb-6 mt-2">
        <Link
          href="/log"
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        </Link>
        <h1 className="text-[19px] font-bold text-[#1a2332]">Detail Latihan</h1>
      </div>

      {/* Main Card */}
      <div className="border border-[#eef2f6] rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] mb-6 bg-white overflow-hidden">
        
        {/* Visual Info Alat */}
        {log.alat ? (
          <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-[24px] bg-gray-50 mb-6">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-white border border-gray-200 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={log.alat.foto_path}
                alt={log.alat.nama_alat}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-[#0d9488] tracking-widest uppercase">
                Alat Latihan
              </span>
              <h3 className="font-bold text-gray-900 text-[17px] mt-0.5">
                {log.alat.nama_alat}
              </h3>
            </div>
          </div>
        ) : (
          <div className="p-4 border border-dashed border-gray-200 rounded-[24px] text-center mb-6">
            <p className="text-sm font-semibold text-gray-400">Alat Telah Dihapus</p>
          </div>
        )}

        {/* Set & Reps Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#ccfbf1]/40 border border-[#e2fbf6] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-extrabold text-[#0f766e] uppercase tracking-widest mb-1">
              Jumlah Set
            </span>
            <span className="text-3xl font-extrabold text-gray-900">
              {log.jumlah_set}
            </span>
          </div>
          <div className="bg-[#e0e7ff]/40 border border-[#e2e8fe] rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-extrabold text-[#4f46e5] uppercase tracking-widest mb-1">
              Repetisi
            </span>
            <span className="text-3xl font-extrabold text-gray-900">
              {log.jumlah_repetisi}
            </span>
          </div>
        </div>

        {/* Date and Time Details */}
        <div className="space-y-3.5 mb-6 border-t border-gray-100 pt-5">
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">Hari & Tanggal</p>
              <p className="text-sm font-bold text-gray-800">{log.formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">Waktu Latihan</p>
              <p className="text-sm font-bold text-gray-800">{log.formattedTime} WIB</p>
            </div>
          </div>
        </div>

        {/* Catatan Latihan */}
        <div className="border-t border-gray-100 pt-5 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-gray-400" />
            <h4 className="text-[13px] font-bold text-gray-700">
              Catatan Latihan
            </h4>
          </div>
          <div className="bg-field-bg rounded-2xl p-4 min-h-[80px]">
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              {log.catatan_latihan || "Tidak ada catatan untuk sesi latihan ini."}
            </p>
          </div>
        </div>

        {/* Button Actions */}
        <div className="flex gap-4">
          <Link
            href={`/log/${log.id}/edit`}
            className="flex-1 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-[18px] py-3.5 flex items-center justify-center gap-2 font-bold text-sm shadow-[0_6px_15px_rgba(0,103,91,0.2)] transition-all active:scale-95 text-center"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Latihan</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-[18px] py-3.5 flex items-center justify-center gap-2 font-bold text-sm border border-red-100 transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Sesi</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Catatan Latihan?"
        message="Apakah Anda yakin ingin menghapus catatan sesi latihan ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <SuccessOverlay message="Catatan sesi latihan berhasil dihapus." />
        )}
      </AnimatePresence>
    </>
  );
}
