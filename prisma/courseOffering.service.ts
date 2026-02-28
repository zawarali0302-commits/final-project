import prisma from "@/lib/prisma"

export const getCourseOfferingsByInstitute = async (instituteId: string) => {
  return prisma.courseOffering.findMany({
    where: { term: { program: { department: { instituteId } } } },
    include: {
      course: true,
      term: true,
    },
  })
}

/**
* Assign a course to a term (term-level, not yet section-level)
*/
export const addCourseToTerm = async (courseId: string, termId: string) => {
  // Prevent duplicate term-level assignment
  const existing = await prisma.courseOffering.findFirst({
    where: { courseId, termId},
  })
  if (existing) throw new Error("Course is already assigned to this term")

  return prisma.courseOffering.create({
    data: {
      courseId,
      termId,
    },
    include: {
      course: true,
      term: true,
    },
  })
}


/**
 * Get all courses assigned to a term
 */
export const getTermCourses = async (termId: string) => {
  return prisma.courseOffering.findMany({
    where: { termId },
    include: { course: true },
    orderBy: { course: { name: "asc" } },
  })
}

/**
 * Remove a course from a term
 */
export const removeCourseFromTerm = async (
  courseOfferingId: string,
  termId: string
) => {
  if (!courseOfferingId || !termId) {
    throw new Error("Missing required fields")
  }

  const record = await prisma.courseOffering.findUnique({
    where: { id: courseOfferingId },
  })

  if (!record) {
    throw new Error("CourseOffering not found")
  }

  if (record.termId !== termId) {
    throw new Error("Invalid term-course relation")
  }

  await prisma.courseOffering.delete({
    where: { id: courseOfferingId },
  })
}