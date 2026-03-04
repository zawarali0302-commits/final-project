import Link from "next/link"
import { UserRole } from "@/app/generated/prisma/enums"
import { StatCard } from "@/components/admin/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/requireRole"
import { Building2, GraduationCap, Shield, Users } from "lucide-react"
import { getSuperAdminDashboardData } from "@/prisma/superAdmin.service"

export default async function SuperAdminPage() {
  await requireRole([UserRole.SUPER_ADMIN])

  const {
    institutes,
    admins,
    teachers,
    students,
    recentInstitutes,
    recentAdmins,
  } = await getSuperAdminDashboardData()

  const statItems = [
    {
      id: 1,
      title: "Institutes",
      value: institutes,
      subtitle: "Onboarded organizations",
      icon: <Building2 className="h-5 w-5 text-sky-700" />,
      viewAllHref: "/super-admin/institutes",
    },
    {
      id: 2,
      title: "Admins",
      value: admins,
      subtitle: "Platform operators",
      icon: <Shield className="h-5 w-5 text-emerald-700" />,
      viewAllHref: "/super-admin/admins",
    },
    {
      id: 3,
      title: "Teachers",
      value: teachers,
      subtitle: "Total faculty records",
      icon: <GraduationCap className="h-5 w-5 text-amber-700" />,
    },
    {
      id: 4,
      title: "Students",
      value: students,
      subtitle: "Total learner records",
      icon: <Users className="h-5 w-5 text-violet-700" />,
    },
  ]

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
          <h2 className="text-2xl font-semibold sm:text-3xl">Platform Overview</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Track institute onboarding and admin activity across the system.
          </p>
        </div>
      </section>

      <ul className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <li key={item.id} className="h-full">
            <StatCard
              title={item.title}
              value={item.value}
              subtitle={item.subtitle}
              icon={item.icon}
              viewAllHref={item.viewAllHref}
            />
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/70 py-0">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Institutes</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/super-admin/institutes">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInstitutes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No institutes found.</p>
            ) : (
              recentInstitutes.map((institute) => (
                <div key={institute.id} className="rounded-xl border bg-card/80 p-3">
                  <p className="font-medium">{institute.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Users: {institute._count.users} | Departments: {institute._count.departments}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 py-0">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Admins</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/super-admin/admins">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAdmins.length === 0 ? (
              <p className="text-sm text-muted-foreground">No admins found.</p>
            ) : (
              recentAdmins.map((admin) => (
                <div key={admin.id} className="rounded-xl border bg-card/80 p-3">
                  <p className="font-medium">{admin.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Institute: {admin.institute?.name ?? "Not assigned"}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
