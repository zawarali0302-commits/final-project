import Link from "next/link"
import { UserRole } from "@/app/generated/prisma/enums"
import { StatCard } from "@/components/admin/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/requireRole"
import prisma from "@/lib/prisma"
import { Building2, GraduationCap, Shield, Users } from "lucide-react"

export default async function SuperAdminPage() {
  await requireRole([UserRole.SUPER_ADMIN])

  const [institutes, admins, teachers, students, recentInstitutes, recentAdmins] = await Promise.all([
    prisma.institute.count(),
    prisma.user.count({ where: { role: UserRole.ADMIN } }),
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.institute.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        _count: {
          select: {
            users: true,
            departments: true,
          },
        },
      },
    }),
    prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        institute: {
          select: { name: true },
        },
      },
    }),
  ])

  const statItems = [
    {
      id: 1,
      title: "Institutes",
      value: institutes,
      icon: <Building2 className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: 2,
      title: "Admins",
      value: admins,
      icon: <Shield className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: 3,
      title: "Teachers",
      value: teachers,
      icon: <GraduationCap className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: 4,
      title: "Students",
      value: students,
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Platform Overview</h2>
        <p className="text-sm text-muted-foreground">
          Track institute onboarding and admin activity across the system.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <li key={item.id}>
            <StatCard title={item.title} value={item.value} icon={item.icon} />
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
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
                <div key={institute.id} className="rounded-lg border p-3">
                  <p className="font-medium">{institute.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Users: {institute._count.users} | Departments: {institute._count.departments}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
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
                <div key={admin.id} className="rounded-lg border p-3">
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
