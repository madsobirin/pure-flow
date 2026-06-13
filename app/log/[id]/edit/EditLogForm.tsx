"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import SuccessOverlay from "../../../../components/dashboard/SuccessOverlay";
import { AnimatePresence } from "motion/react";

interface AlatDropdownType {
  id: number;
  nama_alat: string;
}

interface LogEditType {
  id: number;
  alat_id: number;
  jumlah_set: number;
  jumlah_repetisi: number;
  catatan_latihan: string | null;
  tanggal_latihan: string;
}

interface EditLogFormProps {
  log: LogEditType;
  equipments: AlatDropdownType[];
}

// Helper untuk format ISO string ke format datetime-local input (YYYY-MM-DDTHH:MM)
const formatDateTimeLocal = (isoString: string): string => {
  const date = new Date(isoString);
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset)
    .toISOString()
    .slice(0, 16);
  return localISOTime;
};

export default function EditLogForm({ log, equipments }: EditLogFormProps) {
  const router = useRouter();

  // States
  const [alatId, setAlatId] = useState(log.alat_id);
  const [jumlahSet, setJumlahSet] = useState(log.jumlah_set);
  const [jumlahRepetisi, setJumlahRepetisi] = useState(log.jumlah_repetisi);
  const [catatanLatihan, setCatatanLatihan] = useState(
    log.catatan_latihan || "",
  );
  const [tanggalLatihan, setTanggalLatihan] = useState(
    formatDateTimeLocal(log.tanggal_latihan),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!alatId) {
      setError("Silakan pilih alat olahraga.");
      return;
    }
    if (jumlahSet <= 0) {
      setError("Jumlah set harus lebih dari 0.");
      return;
    }
    if (jumlahRepetisi <= 0) {
      setError("Jumlah repetisi harus lebih dari 0.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/log/${log.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alat_id: alatId,
          jumlah_set: jumlahSet,
          jumlah_repetisi: jumlahRepetisi,
          catatan_latihan: catatanLatihan.trim() || null,
          tanggal_latihan: new Date(tanggalLatihan).toISOString(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setShowSuccessOverlay(true);

        // Delay 1500ms agar user bisa melihat animasi sukses
        setTimeout(() => {
          router.push(`/log`);
          router.refresh();
        }, 1500);
      } else {
        setError(result.message || "Gagal memperbarui catatan latihan.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Update log error:", err);
      setError("Gagal terhubung ke server.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-4 mb-6 mt-2">
          <Link
            href={`/log/${log.id}`}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          </Link>
          <h1 className="text-[19px] font-bold text-[#1a2332]">
            Edit Sesi Latihan
          </h1>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-2xl text-xs flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="border border-[#eef2f6] rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] mb-6 bg-white">
          {/* Pilih Alat */}
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">
              Pilih Alat
            </label>
            <select
              value={alatId}
              onChange={(e) => {
                setAlatId(parseInt(e.target.value));
                if (error) setError("");
              }}
              className="w-full bg-field-bg border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all cursor-pointer"
              disabled={isLoading}
            >
              <option value="">-- Pilih Alat --</option>
              {equipments.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nama_alat}
                </option>
              ))}
            </select>
          </div>

          {/* Jumlah Set */}
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">
              Jumlah Set
            </label>
            <input
              type="number"
              placeholder="Jumlah Set"
              value={jumlahSet || ""}
              onChange={(e) => {
                setJumlahSet(parseInt(e.target.value) || 0);
                if (error) setError("");
              }}
              min="1"
              className="w-full bg-field-bg border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Jumlah Repetisi */}
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">
              Jumlah Repetisi (Reps)
            </label>
            <input
              type="number"
              placeholder="Jumlah Repetisi"
              value={jumlahRepetisi || ""}
              onChange={(e) => {
                setJumlahRepetisi(parseInt(e.target.value) || 0);
                if (error) setError("");
              }}
              min="1"
              className="w-full bg-field-bg border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
              disabled={isLoading}
            />
          </div>

          {/* Tanggal & Waktu Latihan */}
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">
              Tanggal & Waktu Latihan
            </label>
            <input
              type="datetime-local"
              value={tanggalLatihan}
              onChange={(e) => setTanggalLatihan(e.target.value)}
              className="w-full bg-field-bg border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all cursor-pointer"
              disabled={isLoading}
            />
          </div>

          {/* Catatan Latihan */}
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">
              Catatan Latihan (Opsional)
            </label>
            <textarea
              placeholder="Misal: Reps terakhir terasa berat..."
              value={catatanLatihan}
              onChange={(e) => setCatatanLatihan(e.target.value)}
              rows={4}
              className="w-full bg-field-bg border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-[20px] py-4 flex items-center justify-center gap-2 font-bold text-[15px] shadow-[0_8px_20px_rgba(0,103,91,0.25)] transition-all active:scale-95 cursor-pointer disabled:opacity-80"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccessOverlay && (
          <SuccessOverlay message="Catatan sesi latihan berhasil diperbarui." />
        )}
      </AnimatePresence>
    </>
  );
}
