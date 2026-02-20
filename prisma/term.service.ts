import prisma from "@/lib/prisma"

// --- Get all terms ---
export const getTerms = async () => {
  return prisma.term.findMany({
    include: {
      program: true,
      academicYear: true,
      sections: {
        include: {
          studentEnrollments: {
            include: { student: true },
          },
        },
      },
      courseOfferings: {
        include: {
          course: true,
        },
      },
    },
  })
}

// --- Get term by ID ---
export const getTermById = async (id: string) => {
  return prisma.term.findUnique({
    where: { id },
    include: {
      program: true,
      academicYear: true,
      sections: {
        include: {
          studentEnrollments: {
            include: { student: true },
          },
        },
      },
      courseOfferings: {
        include: {
          course: true,
        },
      },
    },
  })
}

// --- Add a new term ---
export const addTerm = async (
  name: string,
  programId: string,
  academicYearId: string
) => {
  
  return prisma.term.create({
    data: {
      name,
      programId,
      academicYearId,
    },
  })
}

// --- Edit a term ---
export const editTerm = async (
  id: string,
  data: Partial<{
    name: string
    programId: string
    academicYearId: string
  }>
) => {
  const term = await prisma.term.findUnique({ where: { id } })
  if (!term) throw new Error("Term not found")

  // Optional: prevent duplicate order on edit
  if ((data.programId || term.programId) && (data.academicYearId || term.academicYearId)) {
    const duplicate = await prisma.term.findFirst({
      where: {
        id: { not: id },
        programId: data.programId ?? term.programId,
        academicYearId: data.academicYearId ?? term.academicYearId,
      },
    })
    if (duplicate) throw new Error("Term order already exists for this academic year")
  }

  return prisma.term.update({
    where: { id },
    data,
  })
}

// --- Remove a term ---
export const removeTerm = async (id: string) => {
  const term = await prisma.term.findUnique({ where: { id } })
  if (!term) throw new Error("Term not found")

  return prisma.term.delete({ where: { id } })
}
