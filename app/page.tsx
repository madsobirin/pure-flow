import DashboardHeader from "../components/dashboard/DashboardHeader";
import Greeting from "../components/dashboard/Greeting";
import StatsOverview from "../components/dashboard/StatsOverview";
import LogButton from "../components/dashboard/LogButton";
import RecentActivity from "../components/dashboard/RecentActivity";
import BottomNav from "../components/dashboard/BottomNav";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      {/* Mobile container - centered on desktop */}
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        {/* Main scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />
          <Greeting />
          <StatsOverview />
          <LogButton />
          <RecentActivity />
        </div>

        {/* Fixed bottom navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
