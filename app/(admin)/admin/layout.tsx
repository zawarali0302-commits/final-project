import { requireRole } from "@/lib/requireRole"
import { UserRole } from "@/app/generated/prisma/enums"
import AdminClientLayout from "./admin-client-layout"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.TEACHER])
  return <AdminClientLayout>{children}</AdminClientLayout>
}