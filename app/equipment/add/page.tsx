import DashboardHeader from "../../components/dashboard/DashboardHeader";
import BottomNav from "../../components/dashboard/BottomNav";
import { ArrowLeft, Camera, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AddEquipmentPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />
          
          <div className="flex items-center gap-4 mb-6 mt-2">
            <Link href="/equipment" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            </Link>
            <h1 className="text-[19px] font-bold text-[#1a2332]">Tambah Alat</h1>
          </div>

          <div className="border border-[#eef2f6] rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.015)] mb-6">
            
            {/* Nama Alat */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">Nama Alat</label>
              <input 
                type="text" 
                placeholder="Misal: Dumbbell 5kg, Treadmill..." 
                className="w-full bg-[#f8f9fa] border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
              />
            </div>

            {/* Foto Alat */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">Foto Alat</label>
              <div className="border-[1.5px] border-dashed border-[#b3c7c2] rounded-[24px] p-6 flex flex-col items-center justify-center gap-4">
                <div className="flex gap-10">
                  {/* Kamera */}
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-[#c9f2eb] rounded-full flex items-center justify-center group-hover:bg-[#a6eedb] transition-colors">
                      <Camera className="w-6 h-6 text-brand-teal" strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-bold text-brand-teal">Kamera</span>
                  </button>

                  {/* Galeri */}
                  <button className="flex flex-col items-center gap-2 group">
                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:bg-gray-50 transition-colors">
                      <ImageIcon className="w-6 h-6 text-gray-600" strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-700">Galeri</span>
                  </button>
                </div>
                
                <p className="text-center text-[11px] text-gray-400 mt-1 font-medium px-2 leading-relaxed">
                  Ambil foto baru atau pilih dari galeri<br/>untuk identifikasi mudah.
                </p>
              </div>
            </div>

            {/* Catatan Alat */}
            <div className="mb-6">
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">Catatan Alat (Opsional)</label>
              <textarea 
                placeholder="Misal: Beban maksimal 50kg, dipakai untuk upper body..." 
                rows={4}
                className="w-full bg-[#f8f9fa] border-none rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all resize-none"
              />
            </div>
            
            {/* Save Button */}
            <button className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white rounded-[20px] py-4 flex items-center justify-center gap-2 font-bold text-[15px] shadow-[0_8px_20px_rgba(0,103,91,0.25)] transition-all active:scale-95">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
              <span>Save Equipment</span>
            </button>

          </div>
        </div>
        
        <BottomNav activeTab="equipment" />
      </div>
    </div>
  );
}
