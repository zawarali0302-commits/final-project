import DashboardHeader from "@/components/admin/dashboard-header";
import DashboardStats from "@/components/admin/dashboard-stats";
import { QuickActions } from "@/components/admin/quick-actions";
import { SkeletonText } from "@/components/skeleton-text";

export default function AdminDashboard() {
  
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <SkeletonText />
      <DashboardStats />
      <QuickActions />
    </div>
  )
}
