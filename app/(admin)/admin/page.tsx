import { UserRole } from "@/app/generated/prisma/enums";
import DashboardHeader from "@/components/admin/dashboard-header";
import DashboardStats from "@/components/admin/dashboard-stats";
import { QuickActions } from "@/components/admin/quick-actions";
import { requireRole } from "@/lib/requireRole";

export default async function AdminDashboard() {
  await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <DashboardStats />
      <QuickActions />
    </div>
  )
}
