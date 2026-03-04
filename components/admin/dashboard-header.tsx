import { getInstituteById } from "@/prisma/institute.service"
import { getUserByClerkId } from "@/prisma/user.service"
import { Building2, CalendarDays } from "lucide-react"

const DashboardHeader = async () => {
  const dbUser = await getUserByClerkId()
  if (!dbUser?.instituteId) {
    return (
      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Institute setup pending</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          No institute is linked to this account yet.
        </p>
      </section>
    )
  }

  const institute = await getInstituteById(dbUser.instituteId)
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date())

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Institute Overview
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {institute?.name ?? "Institute Name"}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Manage teachers, students, programs, and results from one place.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>{today}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5">
              <Building2 className="h-4 w-4" />
              <span>Admin Workspace</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardHeader
