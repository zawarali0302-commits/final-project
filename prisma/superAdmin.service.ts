import { UserRole } from "@/app/generated/prisma/enums"
import prisma from "@/lib/prisma"

export const getSuperAdminDashboardData = async () => {
  const [institutes, admins, teachers, students, recentInstitutes, recentAdmins] =
    await Promise.all([
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

  return {
    institutes,
    admins,
    teachers,
    students,
    recentInstitutes,
    recentAdmins,
  }
}
