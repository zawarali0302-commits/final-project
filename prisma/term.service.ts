import prisma from "@/lib/prisma"
import { EnrollmentStatus } from "@/app/generated/prisma/enums"

// --- Get all terms ---
export const getTermsByInstitute = async (instituteId: string) => {
  return prisma.term.findMany({
    where: { program: { department: { instituteId } } },
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
export const getTerms = async (programId: string) => {
  return prisma.term.findMany({
    where: { programId },
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

export const promoteAllStudentsToTargetTermByInstitute = async (
  sourceTermId: string,
  targetAcademicYearId: string,
  targetTermId: string,
  targetSectionId: string,
  instituteId: string
) => {
  const sourceTerm = await prisma.term.findFirst({
    where: {
      id: sourceTermId,
      program: {
        department: {
          instituteId,
        },
      },
    },
    include: {
      academicYear: true,
    },
  })

  if (!sourceTerm) {
    throw new Error("Source term not found")
  }

  const targetTerm = await prisma.term.findFirst({
    where: {
      id: targetTermId,
      academicYearId: targetAcademicYearId,
      programId: sourceTerm.programId,
      program: {
        department: {
          instituteId,
        },
      },
    },
    include: {
      sections: {
        select: {
          id: true,
          name: true,
        },
      },
      courseOfferings: {
        select: {
          id: true,
        },
      },
      academicYear: true,
    },
  })

  if (!targetTerm) {
    throw new Error("Target term is invalid for this program")
  }

  if (targetTerm.courseOfferings.length === 0) {
    throw new Error("Target term has no course offerings")
  }

  const targetSection = targetTerm.sections.find((item) => item.id === targetSectionId)
  if (!targetSection) {
    throw new Error("Target section does not belong to selected term")
  }

  const sourceEnrollments = await prisma.studentEnrollment.findMany({
    where: {
      section: {
        termId: sourceTerm.id,
      },
      status: EnrollmentStatus.ACTIVE,
    },
    select: {
      studentId: true,
      sectionId: true,
    },
  })

  if (sourceEnrollments.length === 0) {
    throw new Error("No active students found in this source term")
  }

  const studentIds = [...new Set(sourceEnrollments.map((item) => item.studentId))]
  const rows: Array<{
    studentId: string
    courseOfferingId: string
    sectionId: string
    status: EnrollmentStatus
  }> = []

  for (const studentId of studentIds) {
    for (const offering of targetTerm.courseOfferings) {
      rows.push({
        studentId,
        courseOfferingId: offering.id,
        sectionId: targetSectionId,
        status: EnrollmentStatus.ACTIVE,
      })
    }
  }

  const inserted = await prisma.$transaction(async (tx) => {
    await tx.studentEnrollment.updateMany({
      where: {
        section: {
          termId: sourceTerm.id,
        },
        studentId: {
          in: studentIds,
        },
        status: EnrollmentStatus.ACTIVE,
      },
      data: {
        status: EnrollmentStatus.COMPLETED,
      },
    })

    const createResult = await tx.studentEnrollment.createMany({
      data: rows,
      skipDuplicates: true,
    })

    return createResult.count
  })

  return {
    sourceTermName: sourceTerm.name,
    targetTermName: targetTerm.name,
    sourceAcademicYear: sourceTerm.academicYear.name,
    targetAcademicYear: targetTerm.academicYear.name,
    studentsProcessed: studentIds.length,
    enrollmentsCreated: inserted,
  }
}
