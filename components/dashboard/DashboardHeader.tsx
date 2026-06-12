import { UserCircle, Settings } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <UserCircle className="w-10 h-10 text-brand-teal" strokeWidth={1.5} />
        <span className="font-bold text-brand-teal text-lg">Ahmad Sobirin</span>
      </div>
      <button className="text-gray-700 hover:text-gray-900 transition-colors">
        <Settings className="w-6 h-6" strokeWidth={1.5} />
      </button>
    </div>
  );
}
