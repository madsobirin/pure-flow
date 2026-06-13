"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit3, Trash2, X, Eye } from "lucide-react";
import ConfirmModal from "../../../components/dashboard/ConfirmModal";
import SuccessOverlay from "../../../components/dashboard/SuccessOverlay";
import { motion, AnimatePresence } from "motion/react";

interface AlatClientType {
  id: number;
  nama_alat: string;
  foto_path: string;
  catatan_alat: string | null;
  created_at: string;
}

interface EquipmentDetailClientProps {
  alat: AlatClientType;
}

export default function EquipmentDetailClient({
  alat,
}: EquipmentDetailClientProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/alat/${alat.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleteModalOpen(false);
        setShowSuccessOverlay(true);

        // Berikan delay 1500ms agar user bisa melihat animasi sukses
        setTimeout(() => {
          router.push("/equipment");
          router.refresh();
        }, 1500);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Gagal menghapus alat.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error("Delete equipment error:", err);
      alert("Terjadi kesalahan koneksi server.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Tombol Back */}
      <div className="flex items-center gap-4 mb-6 mt-2">
        <Link
          href="/equipment"
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        </Link>
        <h1 className="text-[19px] font-bold text-[#1a2332]">Detail Alat</h1>
      </div>

      {/* Main Card */}
      <div className="border border-[#eef2f6] rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] mb-6 bg-white overflow-hidden">
        {/* Gambar Alat */}
        <div
          onClick={() => setIsPreviewOpen(true)}
          className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-6 cursor-zoom-in hover:opacity-95 transition-opacity group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={alat.foto_path}
            alt={alat.nama_alat}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg">
              <Eye className="w-3.5 h-3.5" />
              <span>Lihat Foto</span>
            </span>
          </div>
        </div>

        {/* Informasi Alat */}
        <div className="mb-6">
          <span className="bg-[#e0f2fe] text-[#0369a1] px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase">
            Master Data
          </span>
          <h2 className="text-2xl font-extrabold text-[#1a2332] mt-3 mb-2">
            {alat.nama_alat}
          </h2>
          <p className="text-[11px] text-gray-400 font-semibold">
            Daftar Sejak:{" "}
            {new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(alat.created_at))}
          </p>
        </div>

        {/* Catatan Tambahan */}
        <div className="border-t border-gray-100 pt-6 mb-8">
          <h4 className="text-[13px] font-bold text-gray-700 mb-2.5">
            Catatan Alat
          </h4>
          <div className="bg-field-bg rounded-2xl p-4 min-h-[80px]">
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              {alat.catatan_alat || "Tidak ada catatan untuk alat ini."}
            </p>
          </div>
        </div>

        {/* Button Actions */}
        <div className="flex gap-4">
          <Link
            href={`/equipment/${alat.id}/edit`}
            className="flex-1 bg-brand-teal hover:bg-brand-teal-dark text-white rounded-[18px] py-3.5 flex items-center justify-center gap-2 font-bold text-sm shadow-[0_6px_15px_rgba(0,103,91,0.2)] transition-all active:scale-95 text-center"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Alat</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-[18px] py-3.5 flex items-center justify-center gap-2 font-bold text-sm border border-red-100 transition-all active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Alat</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Alat?"
        message={`Apakah Anda yakin ingin menghapus "${alat.nama_alat}"? Semua riwayat catatan latihan terkait alat ini juga akan dihapus permanen.`}
        confirmText="Hapus"
        cancelText="Batal"
        isLoading={isDeleting}
      />

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <SuccessOverlay message="Alat berhasil dihapus dari daftar Anda." />
        )}
      </AnimatePresence>

      {/* Lightbox Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />
            {/* Image */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-full max-h-[85vh] z-10 flex items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={alat.foto_path}
                alt={alat.nama_alat}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
