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



export async function removeCourseFromSection(sectionCourseId: string, sectionId: string) {

  if (!sectionCourseId || !sectionId) return
  const record = await prisma.sectionCourse.findUnique({
    where: { id: sectionCourseId },
  })
  if (!record) throw new Error("SectionCourse record not found")
    
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


