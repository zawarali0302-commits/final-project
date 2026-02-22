import prisma from "@/lib/prisma"


// prisma/department.service.ts

export const getDepartments = async () => {
  return prisma.department.findMany()
}


export const getDepartmentById = async (id: string) => {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      institute: true,
      teachers: true,
      programs: true,
      courses: true
    }
  })

  return department
}

export const addDepartment = async (name: string) => {
  const institute = await prisma.institute.findFirst({
    select: { id: true }
  })

  if (!institute) {
    throw new Error("No institute found. Please create an institute first.")
  }

  return prisma.department.create({
    data: {
      name,
      instituteId: institute.id,
    },
  })
}

export const editDepartment = async (
  id: string,
  data: Partial<{
    name: string
    instituteId: string
  }>
) => {
  return prisma.department.update({
    where: { id },
    data,
  })
}

export const removeDepartment = async (id: string) => {
  const department = await prisma.department.findUnique({
    where: { id },
    include: {
      programs: true,
      teachers: true,
    },
  })

  if (!department) {
    throw new Error("Department not found")
  }

  if (department.programs.length || department.teachers.length) {
    throw new Error("Cannot delete department with assigned programs or teachers")
  }

  return prisma.department.delete({
    where: { id },
  })
}

// export const addDepartment = async (name: string) => {
//         const department = await prisma.department.create({
//             data: {
//                 name,
//                 classes,
//                 teachers,
//                 subjects
//             }
//         })
//     return department
// }