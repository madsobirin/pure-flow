import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import BottomNav from "../../../components/dashboard/BottomNav";
import { ChevronDown, Plus, Minus, Check } from "lucide-react";

export default function AddLogPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 pb-28">
          <DashboardHeader />

          <div className="flex items-start justify-between mb-1 mt-2">
            <h1 className="text-[20px] font-extrabold text-[#1a2332] leading-tight">
              Tambah latihan
            </h1>
            <div className="text-right">
              <p className="text-[12px] text-gray-500 mb-0.5 font-medium tracking-tight">
                Kamis, 11 Jun 2026
              </p>
              <p className="text-[13px] font-extrabold text-brand-teal">
                03.40
              </p>
            </div>
          </div>

          <p className="text-[13px] text-gray-400 mb-8 font-medium">
            Catat progres harianmu untuk hasil maksimal.
          </p>

          <div className="mb-6">
            <label className="block text-[10px] font-extrabold text-[#1a2332] tracking-widest uppercase mb-2">
              PILIH ALAT
            </label>
            <div className="relative">
              <select className="w-full bg-field-bg border-none rounded-[16px] px-5 py-4 text-[14px] text-gray-600 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium">
                <option value="" disabled selected>
                  Pilih alat dari daftar...
                </option>
                <option value="dumbbell">Dumbbell 5kg</option>
                <option value="treadmill">Treadmill</option>
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-[10px] font-extrabold text-[#1a2332] tracking-widest uppercase mb-2">
                JUMLAH SET
              </label>
              <div className="flex items-stretch h-[54px] bg-field-bg rounded-[16px] overflow-hidden">
                <div className="flex-1 flex items-center justify-center border-r border-[#eef2f6]">
                  <span className="text-[24px] text-gray-400 font-light leading-none">
                    0
                  </span>
                </div>
                <div className="flex flex-col w-[38px] shrink-0 bg-white">
                  <button className="flex-1 flex items-center justify-center border-b border-[#e8eaec] bg-field-bg hover:bg-white transition-colors">
                    <Plus
                      className="w-3.5 h-3.5 text-brand-teal"
                      strokeWidth={2.5}
                    />
                  </button>
                  <button className="flex-1 flex items-center justify-center bg-field-bg hover:bg-white transition-colors">
                    <Minus
                      className="w-3.5 h-3.5 text-brand-teal"
                      strokeWidth={2.5}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-[10px] font-extrabold text-[#1a2332] tracking-widest uppercase mb-2">
                JUMLAH REPETISI
              </label>
              <div className="flex items-stretch h-[54px] bg-field-bg rounded-[16px] overflow-hidden">
                <div className="flex-1 flex items-center justify-center border-r border-[#eef2f6]">
                  <span className="text-[24px] text-gray-400 font-light leading-none">
                    0
                  </span>
                </div>
                <div className="flex flex-col w-[38px] shrink-0 bg-white">
                  <button className="flex-1 flex items-center justify-center border-b border-[#e8eaec] bg-field-bg hover:bg-white transition-colors">
                    <Plus
                      className="w-3.5 h-3.5 text-brand-teal"
                      strokeWidth={2.5}
                    />
                  </button>
                  <button className="flex-1 flex items-center justify-center bg-field-bg hover:bg-white transition-colors">
                    <Minus
                      className="w-3.5 h-3.5 text-brand-teal"
                      strokeWidth={2.5}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-[10px] font-extrabold text-[#1a2332] tracking-widest uppercase mb-2">
              CATATAN LATIHAN{" "}
              <span className="text-[#a8b0ba] font-medium lowercase tracking-normal">
                (opsional)
              </span>
            </label>
            <textarea
              placeholder="Bagaimana rasanya set terakhir?"
              rows={5}
              className="w-full bg-field-bg border-none rounded-[16px] p-5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all resize-none"
            />
          </div>

          <button className="w-full bg-brand-teal hover:bg-brand-teal/80 text-white rounded-full py-4 flex items-center justify-center gap-2.5 font-bold text-[16px] shadow-[0_8px_20px_rgba(26,183,157,0.25)] transition-all active:scale-95 mb-10">
            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-[#1ab79d]" strokeWidth={4} />
            </div>
            <span>Simpan Latihan</span>
          </button>

          <p className="text-center text-[11px] text-[#ccd2d8] font-medium px-4">
            Log ini akan disimpan dengan timestamp saat ini.
          </p>
        </div>

        <BottomNav activeTab="log" />
      </div>
    </div>
  );
}
