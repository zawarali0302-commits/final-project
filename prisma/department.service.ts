import prisma from "@/lib/prisma"

export const getDepartmentsByInstitute = async (instituteId: string) => {
  return prisma.department.findMany({
    where: { instituteId }
  })
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

export const addDepartment = async (name: string, instituteId: string) => {
  const institute = await prisma.institute.findUnique({
    where: { id: instituteId }
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
