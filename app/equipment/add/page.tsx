import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import BottomNav from "../../../components/dashboard/BottomNav";
import AddEquipmentForm from "./AddEquipmentForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AddEquipmentPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  // Protect page
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] flex justify-center w-full">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-sm flex flex-col md:my-8 md:rounded-[40px] md:min-h-[850px] md:shadow-xl md:border md:border-gray-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 pb-28">
          <DashboardHeader />
          <AddEquipmentForm />
        </div>

        <BottomNav activeTab="equipment" />
      </div>
    </div>
  );
}
