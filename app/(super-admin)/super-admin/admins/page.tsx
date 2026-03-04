import { UserRole } from "@/app/generated/prisma/enums"
import { requireRole } from "@/lib/requireRole"

export default async function SuperAdminAdminsPage() {
  await requireRole([UserRole.SUPER_ADMIN])

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
        <h2 className="text-2xl font-semibold sm:text-3xl">Admins</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Admin management page coming soon.
        </p>
      </div>
    </section>
  )
}
