import { Check } from "lucide-react";
import Link from "next/link";

interface Activity {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  image: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1a2332]">Recent Activity</h2>
        <Link
          href="/log"
          className="text-brand-teal font-bold text-sm hover:underline cursor-pointer"
        >
          See All
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 bg-field-bg rounded-[24px] border border-dashed border-gray-200">
          <p className="text-xs text-gray-500 font-semibold mb-1">
            Belum ada latihan dicatat
          </p>
          <p className="text-[10px] text-gray-400">
            Silakan catat latihan pertama Anda hari ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between bg-white border border-[#eef2f6] rounded-[24px] p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-gray-50 border border-gray-100 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-[17px] mb-0.5">
                    {activity.title}
                  </h3>
                  <p className="text-gray-500 text-[13px] mb-2">
                    {activity.subtitle}
                  </p>
                  <span
                    className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${activity.categoryColor} ${activity.categoryBg}`}
                  >
                    {activity.category}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 bg-[#dbf5ef] rounded-full flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-brand-teal" strokeWidth={3} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
