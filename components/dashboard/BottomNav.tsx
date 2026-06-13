import { Home, Dumbbell, PlusCircle, Calendar } from "lucide-react";
import Link from "next/link";

type Tab = "home" | "equipment" | "log" | "history";

interface BottomNavProps {
  activeTab?: Tab;
}

// 1. Definisikan data menu dalam bentuk array
const NAV_ITEMS = [
  { id: "home", label: "Home", href: "/", icon: Home },
  { id: "equipment", label: "Equipment", href: "/equipment", icon: Dumbbell },
  { id: "log", label: "Log", href: "/log", icon: PlusCircle },
  { id: "history", label: "History", href: "/history", icon: Calendar },
] as const;

export default function BottomNav({ activeTab = "home" }: BottomNavProps) {
  return (
    // Mengubah pembungkus luar menjadi elemen <nav>
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full">
      <div className="w-full max-w-md bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.02)] sm:rounded-t-3xl md:rounded-b-[40px] md:bottom-2 md:w-[calc(100%-16px)]">
        {/* 2. Loop menu menggunakan .map() */}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center gap-1.5 group"
            >
              <Icon
                className={`w-[26px] h-[26px] transition-colors ${
                  isActive
                    ? "text-brand-teal"
                    : "text-gray-400 group-hover:text-gray-700"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] transition-colors ${
                  isActive
                    ? "font-bold text-brand-teal"
                    : "font-semibold text-gray-400 group-hover:text-gray-700"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
