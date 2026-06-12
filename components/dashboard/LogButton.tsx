import { Plus } from "lucide-react";

export default function LogButton() {
  return (
    <button className="w-full bg-[#1ab79d] hover:bg-brand-teal text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-bold text-lg shadow-[0_8px_20px_rgba(26,183,157,0.3)] transition-all active:scale-95 mb-8">
      <div className="bg-white rounded-full p-0.5">
        <Plus className="w-4 h-4 text-[#1ab79d]" strokeWidth={4} />
      </div>
      <span>Log Latihan</span>
    </button>
  );
}
