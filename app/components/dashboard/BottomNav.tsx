import { Home, Dumbbell, PlusCircle, Calendar } from "lucide-react";
import Link from "next/link";

type Tab = "home" | "equipment" | "log" | "history";

interface BottomNavProps {
  activeTab?: Tab;
}

export default function BottomNav({ activeTab = "home" }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full">
      <div className="w-full max-w-md bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.02)] sm:rounded-t-3xl md:rounded-b-[40px] md:bottom-2 md:w-[calc(100%-16px)]">
        <Link href="/" className="flex flex-col items-center gap-1.5 group">
          <Home
            className={`w-[26px] h-[26px] transition-colors ${activeTab === "home" ? "text-brand-teal" : "text-gray-400 group-hover:text-gray-700"}`}
            strokeWidth={activeTab === "home" ? 2.5 : 2}
          />
          <span
            className={`text-[10px] ${activeTab === "home" ? "font-bold text-brand-teal" : "font-semibold text-gray-400 group-hover:text-gray-700 transition-colors"}`}
          >
            Home
          </span>
        </Link>

        <Link
          href="/equipment"
          className="flex flex-col items-center gap-1.5 group"
        >
          <Dumbbell
            className={`w-[26px] h-[26px] transition-colors ${activeTab === "equipment" ? "text-brand-teal" : "text-gray-400 group-hover:text-gray-700"}`}
            strokeWidth={activeTab === "equipment" ? 2.5 : 2}
          />
          <span
            className={`text-[10px] ${activeTab === "equipment" ? "font-bold text-brand-teal" : "font-semibold text-gray-400 group-hover:text-gray-700 transition-colors"}`}
          >
            Equipment
          </span>
        </Link>

        <button className="flex flex-col items-center gap-1.5 group">
          <PlusCircle
            className={`w-[26px] h-[26px] transition-colors ${activeTab === "log" ? "text-brand-teal" : "text-gray-400 group-hover:text-gray-700"}`}
            strokeWidth={activeTab === "log" ? 2.5 : 2}
          />
          <span
            className={`text-[10px] ${activeTab === "log" ? "font-bold text-brand-teal" : "font-semibold text-gray-400 group-hover:text-gray-700 transition-colors"}`}
          >
            Log
          </span>
        </button>

        <button className="flex flex-col items-center gap-1.5 group">
          <Calendar
            className={`w-[26px] h-[26px] transition-colors ${activeTab === "history" ? "text-brand-teal" : "text-gray-400 group-hover:text-gray-700"}`}
            strokeWidth={activeTab === "history" ? 2.5 : 2}
          />
          <span
            className={`text-[10px] ${activeTab === "history" ? "font-bold text-brand-teal" : "font-semibold text-gray-400 group-hover:text-gray-700 transition-colors"}`}
          >
            History
          </span>
        </button>
      </div>
    </div>
  );
}
