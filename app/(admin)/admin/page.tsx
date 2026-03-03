import { UserRole } from "@/app/generated/prisma/enums";
import DashboardHeader from "@/components/admin/dashboard-header";
import DashboardStats from "@/components/admin/dashboard-stats";
import { QuickActions } from "@/components/admin/quick-actions";
import { SkeletonText } from "@/components/skeleton-text";
import { requireRole } from "@/lib/requireRole";

export default async function AdminDashboard() {
  await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <SkeletonText />
      <DashboardStats />
      <QuickActions />
    </div>
  )
}
