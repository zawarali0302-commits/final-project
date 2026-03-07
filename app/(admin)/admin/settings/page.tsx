import { UserRole } from "@/app/generated/prisma/enums"
import AdminSettingsForm from "@/components/forms/admin-settings-form"
import { getInstituteById } from "@/prisma/institute.service"
import { requireRole } from "@/lib/requireRole"

export default async function AdminSettingsPage() {
  const authUser = await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])

  if (!authUser.instituteId) {
    return (
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="p-6 sm:p-7">
          <h2 className="text-2xl font-semibold sm:text-3xl">Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            No institute is linked to your account yet.
          </p>
        </div>
      </section>
    )
  }

  const institute = await getInstituteById(authUser.instituteId)

  if (!institute) {
    return (
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="p-6 sm:p-7">
          <h2 className="text-2xl font-semibold sm:text-3xl">Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Institute details could not be loaded.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
          <h2 className="text-2xl font-semibold sm:text-3xl">Settings</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage institute profile.
          </p>
        </div>
      </div>

      <AdminSettingsForm
        institute={{
          id: institute.id,
          name: institute.name,
          location: institute.location,
          type: institute.type,
        }}
      />
    </section>
  )
}
