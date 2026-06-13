"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";

export default function AddEquipmentForm() {
  const router = useRouter();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // States
  const [namaAlat, setNamaAlat] = useState("");
  const [catatanAlat, setCatatanAlat] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTriggerCamera = () => {
    cameraInputRef.current?.click();
  };

  const handleTriggerGallery = () => {
    galleryInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar.");
        return;
      }
      // Max 5MB file size
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB.");
        return;
      }

      setFotoFile(file);
      setError("");

      // Revoke old object URL if exists
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFotoFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAlat.trim()) {
      setError("Nama alat wajib diisi.");
      return;
    }
    if (!fotoFile) {
      setError("Foto alat wajib diunggah.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("nama_alat", namaAlat.trim());
    formData.append("foto_alat", fotoFile);
    if (catatanAlat.trim()) {
      formData.append("catatan_alat", catatanAlat.trim());
    }

    // Buat item sementara (Optimistic UI)
    const tempId = `temp-${Date.now()}`;
    const tempItem = {
      id: tempId,
      nama_alat: namaAlat.trim(),
      catatan_alat: catatanAlat.trim() || null,
      foto_path: previewUrl || "",
    };

    // Simpan ke localStorage agar bisa dibaca di list page
    if (typeof window !== "undefined") {
      const currentTemp = JSON.parse(
        localStorage.getItem("uploading_equipments") || "[]",
      );
      localStorage.setItem(
        "uploading_equipments",
        JSON.stringify([...currentTemp, tempItem]),
      );
    }

    // Jalankan request di background tanpa await agar transisi halaman instan
    fetch("/api/alat", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const result = await res.json();
          console.error("Background upload failed:", result.message);
        }
      })
      .catch((err) => {
        console.error("Background upload network error:", err);
      })
      .finally(() => {
        // Bersihkan dari localStorage setelah selesai (sukses/gagal)
        if (typeof window !== "undefined") {
          const currentTemp = JSON.parse(
            localStorage.getItem("uploading_equipments") || "[]",
          );
          const filtered = currentTemp.filter(
            (item: any) => item.id !== tempId,
          );
          localStorage.setItem(
            "uploading_equipments",
            JSON.stringify(filtered),
          );
          // Kirim custom event agar list component melakukan re-fetch data riil
          window.dispatchEvent(new Event("equipment-updated"));
        }
      });

    // Pindah halaman ke list secara instan!
    router.push("/equipment");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 mb-6 mt-2">
        <Link
          href="/equipment"
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        </Link>
        <h1 className="text-[19px] font-bold text-[#1a2332]">Tambah Alat</h1>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-50 text-red-600 rounded-2xl text-xs flex items-center gap-2 border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="border border-[#eef2f6] rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] mb-6 bg-white">
        {/* Nama Alat */}
        <div className="mb-6">
          <label className="block text-[13px] font-semibold text-gray-700 mb-2">
            Nama Alat
          </label>
          <input
            type="text"
            placeholder="Misal: Dumbbell 5kg, Treadmill..."
            value={namaAlat}
            onChange={(e) => {
              setNamaAlat(e.target.value);
              if (error) setError("");
            }}
            className="w-full bg-field-bg border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
            disabled={isLoading}
          />
        </div>

        {/* Hidden Camera Input */}
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        {/* Hidden Gallery Input */}
        <input
          type="file"
          ref={galleryInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Foto Alat */}
        <div className="mb-6">
          <label className="block text-[13px] font-semibold text-gray-700 mb-2">
            Foto Alat
          </label>

          {previewUrl ? (
            /* Selected Image Preview */
            <div className="relative border border-[#eef2f6] rounded-[24px] overflow-hidden aspect-video bg-gray-50 flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview alat"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-1.5 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Dashed Box triggers selector */
            <div className="border-[1.5px] border-dashed border-[#b3c7c2] rounded-[24px] p-6 flex flex-col items-center justify-center gap-4">
              <div className="flex gap-10">
                {/* Kamera */}
                <button
                  type="button"
                  onClick={handleTriggerCamera}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                  disabled={isLoading}
                >
                  <div className="w-14 h-14 bg-[#c9f2eb] rounded-full flex items-center justify-center group-hover:bg-[#a6eedb] transition-colors">
                    <Camera
                      className="w-6 h-6 text-brand-teal"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-brand-teal">
                    Kamera
                  </span>
                </button>

                {/* Galeri */}
                <button
                  type="button"
                  onClick={handleTriggerGallery}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                  disabled={isLoading}
                >
                  <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:bg-gray-50 transition-colors">
                    <ImageIcon
                      className="w-6 h-6 text-gray-600"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700">
                    Galeri
                  </span>
                </button>
              </div>

              <p className="text-center text-[11px] text-gray-400 mt-1 font-medium px-2 leading-relaxed">
                Ambil foto baru atau pilih dari galeri
                <br />
                untuk identifikasi mudah.
              </p>
            </div>
          )}
        </div>

        {/* Catatan Alat */}
        <div className="mb-6">
          <label className="block text-[13px] font-semibold text-gray-700 mb-2">
            Catatan Alat (Opsional)
          </label>
          <textarea
            placeholder="Misal: Beban maksimal 50kg, dipakai untuk upper body..."
            value={catatanAlat}
            onChange={(e) => setCatatanAlat(e.target.value)}
            rows={4}
            className="w-full bg-field-bg border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all resize-none"
            disabled={isLoading}
          />
        </div>

        {/* Save Button */}
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
              <span>Save Equipment</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
