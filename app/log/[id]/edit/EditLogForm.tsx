"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import SuccessOverlay from "../../../../components/dashboard/SuccessOverlay";
import { AnimatePresence } from "motion/react";

interface AlatDropdownType {
  id: number;
  nama_alat: string;
  foto_path: string;
}

interface LogEditType {
  id: number;
  alat_id: number;
  jumlah_set: number;
  jumlah_repetisi: number;
  berat_alat: number | null;
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
  const [beratAlat, setBeratAlat] = useState(
    log.berat_alat !== null && log.berat_alat !== undefined ? log.berat_alat.toString() : "",
  );
  const [catatanLatihan, setCatatanLatihan] = useState(
    log.catatan_latihan || "",
  );
  const [tanggalLatihan, setTanggalLatihan] = useState(
    formatDateTimeLocal(log.tanggal_latihan),
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
          berat_alat: beratAlat ? parseFloat(beratAlat) : null,
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
            <div className="relative">
              {/* Custom Select Button */}
              <button
                type="button"
                onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
                disabled={isLoading}
                className="w-full bg-field-bg border-none rounded-2xl px-4 py-3.5 text-sm text-gray-700 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium cursor-pointer disabled:opacity-50"
              >
                {(() => {
                  const selectedEquipment = equipments.find((eq) => eq.id === Number(alatId));
                  return selectedEquipment ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white">
                        <img
                          src={selectedEquipment.foto_path}
                          alt={selectedEquipment.nama_alat}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{selectedEquipment.nama_alat}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Pilih alat dari daftar...</span>
                  );
                })()}
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Options Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-[#eef2f6] rounded-[20px] shadow-xl z-20 max-h-[250px] overflow-y-auto p-2 space-y-1">
                    {equipments.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-gray-400 text-center font-medium">
                        Belum ada alat olahraga.
                      </div>
                    ) : (
                      equipments.map((eq) => (
                        <button
                          key={eq.id}
                          type="button"
                          onClick={() => {
                            setAlatId(eq.id);
                            setIsDropdownOpen(false);
                            if (error) setError("");
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[12px] text-[14px] font-medium text-left transition-all ${
                            Number(alatId) === eq.id
                              ? "bg-[#dbf5ef] text-[#0d9488]"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-white">
                            <img
                              src={eq.foto_path}
                              alt={eq.nama_alat}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{eq.nama_alat}</span>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
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

          {/* Berat Alat */}
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-gray-700 mb-2">
              Berat Alat (kg, Opsional)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder="Berat (kg)"
              value={beratAlat}
              onChange={(e) => setBeratAlat(e.target.value)}
              className="w-full bg-field-bg border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
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
