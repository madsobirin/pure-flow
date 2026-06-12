import { Home, Dumbbell, PlusCircle, Calendar } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full">
      <div className="w-full max-w-md bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.02)] sm:rounded-t-3xl md:rounded-b-[40px] md:bottom-2 md:w-[calc(100%-16px)]">
        <button className="flex flex-col items-center gap-1.5 group">
          <Home className="w-[26px] h-[26px] text-brand-teal" strokeWidth={2.5} />
          <span className="text-[10px] font-bold text-brand-teal">Home</span>
        </button>
        
        <button className="flex flex-col items-center gap-1.5 group">
          <Dumbbell className="w-[26px] h-[26px] text-gray-400 group-hover:text-gray-700 transition-colors" strokeWidth={2} />
          <span className="text-[10px] font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">Equipment</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 group">
          <PlusCircle className="w-[26px] h-[26px] text-gray-400 group-hover:text-gray-700 transition-colors" strokeWidth={2} />
          <span className="text-[10px] font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">Log</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 group">
          <Calendar className="w-[26px] h-[26px] text-gray-400 group-hover:text-gray-700 transition-colors" strokeWidth={2} />
          <span className="text-[10px] font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">History</span>
        </button>
      </div>
    </div>
  );
}
