import prisma from "@/lib/prisma"

export const getAcademicYearsByInstitute = async (instituteId: string) => {
  if (!instituteId) {
    throw new Error("Institute ID is required")
  }

  return await prisma.academicYear.findMany({
    where: {
      instituteId,
    },
    orderBy: {
      startDate: "desc",
    },
  })
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

export const editAcademicYear = async (
  id: string,
  name: string,
  startDate: Date,
  endDate: Date,
  instituteId: string
) => {
  return await prisma.academicYear.update({
    where: { id },
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
