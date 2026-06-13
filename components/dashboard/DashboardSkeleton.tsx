export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6 w-full">
      {/* 1. Greeting Skeleton */}
      <div className="space-y-2 pt-4">
        <div className="h-4 bg-gray-200 rounded-md w-24"></div>
        <div className="h-8 bg-gray-200 rounded-md w-48"></div>
      </div>

      {/* 2. StatsOverview Skeleton */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="h-28 bg-gray-100 border border-gray-50 rounded-2xl p-4 flex flex-col justify-between">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-28 bg-gray-100 border border-gray-50 rounded-2xl p-4 flex flex-col justify-between">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      {/* 3. RecentActivity Skeleton */}
      <div className="space-y-3 pt-2">
        {/* Title Section */}
        <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>

        {/* 3 List Items Placholder */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 border border-gray-100 rounded-2xl bg-white"
          >
            {/* Image Placeholder */}
            <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />

            {/* Text Placeholder */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>

            {/* Chevron/Arrow Placeholder */}
            <div className="w-5 h-5 bg-gray-200 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
