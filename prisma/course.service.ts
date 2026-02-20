import prisma from "@/lib/prisma"

export async function getCourses() {
  return prisma.course.findMany({
    include: { 
      department: true
    },
    orderBy: { name: "asc" },
  })
}
export async function getCoursesByDepartment(departmentId: string) {
  return prisma.course.findMany({
    where: { departmentId },
    orderBy: { name: "asc" },
  })
}


export async function getCourseById(id: string) {
  return prisma.course.findUnique({ where: { id } })
}

export async function addCourse(data: {
  name: string
  code: string
  credits?: number
  departmentId: string
}) {
  return prisma.course.create({ data })
}

export async function editCourse(id: string, data: Partial<{ name: string; code: string; credits?: number, departmentId: string }>) {
  return prisma.course.update({ where: { id }, data })
}

export async function removeCourse(id: string) {
  return prisma.course.delete({ where: { id } })
}
