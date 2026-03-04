import prisma from '@/lib/prisma'

export const getSectionCourses = async () => {
  return await prisma.sectionCourse.findMany({
    include: {
      courseOffering: {
        include: { course: true },
      },
      section: true,
    },
  })
}

export const getSectionCoursesByTeacherId = async (teacherId: string) => {
  return prisma.sectionCourse.findMany({
    where: {
      teacherId,
    },
    include: {
      section: true,
      courseOffering: {
        include: {
          term: {
            include: {
              program: true,
            },
          },
          course: {
            include: {
              department: true,
            },
          },
        },
      },
    },
  })
}

export const getSectionCourseDetailByTeacher = async (
  sectionCourseId: string,
  teacherId: string
) => {
  return prisma.sectionCourse.findFirst({
    where: {
      id: sectionCourseId,
      teacherId,
    },
    include: {
      section: true,
      courseOffering: {
        include: {
          term: {
            include: {
              program: true,
              academicYear: true,
            },
          },
          course: {
            include: {
              department: true,
            },
          },
          courseExams: {
            include: {
              examEvent: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  })
}



export async function addSectionCourseTeacher(sectionCourseId: string, teacherId: string | null) {

  await prisma.sectionCourse.update({
    where: { id: sectionCourseId },
    data: {
      teacherId: teacherId || null,
    },
  })

}
// --- Add a course to a section ---
export const addCourseToSection = async (sectionId: string, courseOfferingId: string) => {
  // Check if this courseOffering is already assigned to the section
  const existing = await prisma.sectionCourse.findFirst({
    where: { sectionId, courseOfferingId },
  })
  if (existing) throw new Error('Course is already assigned to this section')

  // Create the assignment
  return prisma.sectionCourse.create({
    data: {
      sectionId,
      courseOfferingId,
    },
    include: {
      section: true,
      courseOffering: {
        include: {
          course: true,
        },
      },
    },
  })
}



export async function removeCourseFromSection(
  sectionCourseId: string,
  sectionId: string
) {
  if (!sectionCourseId || !sectionId) {
    throw new Error("Missing required fields")
  }

  const record = await prisma.sectionCourse.findUnique({
    where: { id: sectionCourseId },
  })

  if (!record) {
    throw new Error("SectionCourse record not found")
  }

  // ✅ Ensure the course belongs to this section
  if (record.sectionId !== sectionId) {
    throw new Error("Invalid section-course relation")
  }

  await prisma.sectionCourse.delete({
    where: { id: sectionCourseId },
  })
}

// --- Get all courseOffering IDs assigned to a section ---
export const getSectionAssignedCourseOfferingIds = async (sectionId: string) => {
  const assigned = await prisma.sectionCourse.findMany({
    where: { sectionId },
    select: { courseOfferingId: true }, // just the IDs
  })
  return assigned.map(a => a.courseOfferingId)
}

// --- Get full courseOfferings assigned to a section (optional) ---
export const getSectionAssignedCourseOfferings = async (sectionId: string) => {
  return prisma.sectionCourse.findMany({
    where: { sectionId },
    include: {
      courseOffering: {
        include: { course: true },
      },
    },
  })
}


