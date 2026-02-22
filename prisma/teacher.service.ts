import prisma from "@/lib/prisma"

export const getTeachers = async () => {
  return prisma.teacher.findMany({
    include: {
      department: true,
      _count: {
        select: {
          sectionCourses: true,
        },
      },
    },
  })
}

export const getTeacherById = async (id: string) => {
  return prisma.teacher.findUnique({
    where: {
      id,
    },
    include: {
      department: true,
    },
  })
}

export async function addTeacher(name: string, email: string, designation: string, departmentId: string, instituteId: string) {

  if (!name || !email || !designation || !departmentId || !instituteId) {
    throw new Error("All fields are required")
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        role: "TEACHER",
        instituteId,
      },
    })

    await tx.teacher.create({
      data: {
        name,
        email,
        designation,
        departmentId,
        instituteId,
        userId: user.id,
      },
    })
  })

}

export async function editTeacher(
  id: string,
  data: Partial<{
    name: string
    email: string
    designation: string
    departmentId: string
  }>
) {
  if (!id) throw new Error("Teacher ID is required")

  const teacher = await prisma.teacher.findUnique({
    where: { id },
    select: { userId: true },
  })

  if (!teacher) {
    throw new Error("Teacher not found")
  }

  await prisma.$transaction(async (tx) => {
    // 1️⃣ Update Teacher
    await tx.teacher.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        designation: data.designation,
        departmentId: data.departmentId,
      },
    })

    // 2️⃣ Update linked User safely
    await tx.user.update({
      where: { id: teacher.userId },
      data: {
        email: data.email,
      },
    })
  })
}

export const removeTeacher = async (id: string) => {
  return prisma.teacher.delete({
    where: {
      id,
    },
  })
}