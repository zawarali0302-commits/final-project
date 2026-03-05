import prisma from "@/lib/prisma"

export const getAdminDashboardStatsByInstitute = async (instituteId: string) => {
  const [teachers, students, programs, results] = await Promise.all([
    prisma.teacher.count({
      where: { instituteId },
    }),
    prisma.student.count({
      where: { instituteId },
    }),
    prisma.program.count({
      where: {
        department: {
          instituteId,
        },
      },
    }),
    prisma.result.count({
      where: {
        student: {
          instituteId,
        },
      },
    }),
  ])

  return {
    teachers,
    students,
    programs,
    results,
  }
}
