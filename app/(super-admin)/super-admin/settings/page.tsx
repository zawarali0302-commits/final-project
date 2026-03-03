import { UserRole } from "@/app/generated/prisma/enums"
import { requireRole } from "@/lib/requireRole"

export default async function SuperAdminSettingsPage() {
  await requireRole([UserRole.SUPER_ADMIN])

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Settings</h2>
      <p className="text-sm text-muted-foreground">Super admin settings coming soon.</p>
    </div>
  )
}
