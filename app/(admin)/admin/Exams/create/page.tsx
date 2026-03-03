import { UserRole } from "@/app/generated/prisma/enums"
import CreateExamForm from "@/components/forms/create-exam--form"
import { requireRole } from "@/lib/requireRole"
import { getSectionsByInstitute } from "@/prisma/section.service"

export default async function CreateExamPage() {
  const user = await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])

  if (!user.instituteId) {
    return <p>No institute found for this user</p>
  }

  const sections = await getSectionsByInstitute(user.instituteId)

  const sectionOptions = sections.map((section) => ({
    id: section.id,
    name: section.name,
    term: {
      name: section.term.name,
      program: {
        name: section.term.program.name,
      },
      academicYear: {
        name: section.term.academicYear.name,
      },
    },
    sectionCourses: section.sectionCourses.map((sectionCourse) => ({
      courseOfferingId: sectionCourse.courseOfferingId,
      courseName: sectionCourse.courseOffering.course.name,
      courseCode: sectionCourse.courseOffering.course.code,
    })),
  }))

  return <CreateExamForm sections={sectionOptions} />
}
