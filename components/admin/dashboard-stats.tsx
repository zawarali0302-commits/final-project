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

  if (![UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(dbUser.role)) {
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
      icon: <Users className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: 2,
      title: "Teachers",
      value: teachers,
      icon: <GraduationCap className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: 3,
      title: "Programs",
      value: programs,
      icon: <LibraryBig className="h-5 w-5 text-muted-foreground" />,
    },
    {
      id: 4,
      title: "Results Generated",
      value: results,
      icon: <FileText className="h-5 w-5 text-muted-foreground" />,
    },
  ]

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <li key={item.id}>
          <StatCard title={item.title} value={item.value} icon={item.icon} />
        </li>
      ))}
    </ul>
  )
}

export default DashboardStats
