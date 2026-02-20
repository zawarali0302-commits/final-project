import prisma from "@/lib/prisma"

export const getAcademicYears = async () => {
  return await prisma.academicYear.findMany()
}

export const getAcademicYearById = async (id: string) => {
  return await prisma.academicYear.findUnique({
    where: { id },
  })
}

export const addAcademicYear = async (
  name: string,
  startDate: Date,
  endDate: Date,
  instituteId: string
) => {
  return await prisma.academicYear.create({
    data: {
      name,
      startDate,
      endDate,
      instituteId,
    },
  })
}

export const setActiveAcademicYear = async (
  academicYearId: string,
  instituteId: string
) => {
  // Deactivate all years first
  await prisma.academicYear.updateMany({
    where: { instituteId },
    data: { isActive: false },
  })

  // Activate selected year
  return await prisma.academicYear.update({
    where: { id: academicYearId },
    data: { isActive: true },
  })
}

export const removeAcademicYear = async (id: string) => {
  return await prisma.academicYear.delete({
    where: { id },
  })
}
