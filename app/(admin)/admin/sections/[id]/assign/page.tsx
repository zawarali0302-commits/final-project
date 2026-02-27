import AssignCourseToSectionForm from '@/components/forms/section-course-assign-form'
import { getTermCourses } from '@/prisma/courseOffering.service'
import { getSectionById } from '@/prisma/section.service'

interface AssignCourseToSectionProps {
  params: Promise<{ id: string }>
}

const AssignCourseToSection = async ({ params }: AssignCourseToSectionProps) => {
  const { id } = await params

  const section = await getSectionById(id)
  if (!section) return <p>Section not found</p>

  const termCourses = await getTermCourses(section.termId)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">{section.name}</h1>
        <p className="text-gray-600">
          Program: {section.term.program.name} | Academic Year:{" "}
          {section.term.academicYear.name}
        </p>
      </div>

      <AssignCourseToSectionForm
        sectionId={section.id}
        termCourses={termCourses}
      />
    </div>
  )
}

export default AssignCourseToSection