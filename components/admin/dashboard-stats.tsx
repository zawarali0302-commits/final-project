import prisma from "@/lib/prisma"
import { StatCard } from "./stat-card"
import { Users, GraduationCap, FileText, LibraryBig } from "lucide-react"
import { UserRole } from "@/app/generated/prisma/enums"
import { getUserByClerkId } from "@/prisma/user.service"

const DashboardStats = async () => {
  let dbUser
  try {
    dbUser = await getUserByClerkId()
  } catch {
    return <div>Not authenticated</div>
  }

  const allowedRoles: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN]
  if (!allowedRoles.includes(dbUser.role)) {
    return <div>Access denied</div>
  }

  if (!dbUser?.instituteId) return <div>No institute found</div>

  const [teachers, students, programs, results] = await Promise.all([
    prisma.teacher.count({
      where: { instituteId: dbUser.instituteId },
    }),
    prisma.student.count({
      where: { instituteId: dbUser.instituteId },
    }),
    prisma.program.count({
      where: {
        department: {
          instituteId: dbUser.instituteId,
        },
      },
    }),
    prisma.result.count({
      where: {
        student: {
          instituteId: dbUser.instituteId,
        },
      },
    }),
  ])

  const statItems = [
    {
      id: 1,
      title: "Students",
      value: students,
      subtitle: "Active enrollment",
      icon: <Users className="h-5 w-5 text-sky-700" />,
      viewAllHref: "/admin/students",
    },
    {
      id: 2,
      title: "Teachers",
      value: teachers,
      subtitle: "Faculty members",
      icon: <GraduationCap className="h-5 w-5 text-emerald-700" />,
      viewAllHref: "/admin/teachers",
    },
    {
      id: 3,
      title: "Programs",
      value: programs,
      subtitle: "Academic offerings",
      icon: <LibraryBig className="h-5 w-5 text-amber-700" />,
      viewAllHref: "/admin/programs",
    },
    {
      id: 4,
      title: "Results Generated",
      value: results,
      subtitle: "Published records",
      icon: <FileText className="h-5 w-5 text-violet-700" />,
      viewAllHref: "/admin/results",
    },
  ]

  return (
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
  )
}

export default DashboardStats
