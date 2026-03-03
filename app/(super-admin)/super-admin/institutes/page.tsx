import { UserRole } from "@/app/generated/prisma/enums"
import { requireRole } from "@/lib/requireRole"

export default async function SuperAdminInstitutesPage() {
  await requireRole([UserRole.SUPER_ADMIN])

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Institutes</h2>
      <p className="text-sm text-muted-foreground">Institute management page coming soon.</p>
    </div>
  )
}
