import { Check } from "lucide-react";

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      title: "Dumbbell Press",
      subtitle: "4 Sets • 12 Reps",
      category: "STRENGTH",
      categoryColor: "text-[#d9657b]",
      categoryBg: "bg-[#fcebef]",
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Treadmill Run",
      subtitle: "30 Minutes • 5km",
      category: "CARDIO",
      categoryColor: "text-[#628fdb]",
      categoryBg: "bg-[#eef4ff]",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop",
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1a2332]">Recent Activity</h2>
        <button className="text-brand-teal font-bold text-sm hover:underline">
          See All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between bg-white border border-[#eef2f6] rounded-[24px] p-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
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
                <p className="text-gray-500 text-[13px] mb-2">{activity.subtitle}</p>
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
    </div>
  );
}
