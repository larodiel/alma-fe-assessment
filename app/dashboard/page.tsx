import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <RecentActivity />
        <DashboardStats />
      </div>
    </div>
  );
}
