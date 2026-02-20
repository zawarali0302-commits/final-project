import { getTermCourses } from '@/prisma/courseOffering.service'
import { Button } from '../ui/button'
import { assignCourseToSection } from '@/app/actions/sectionCourse.actions'
import { getSectionById } from '@/prisma/section.service'

interface AssignCourseToSectionFormProps {
  sectionId: string
  termId: string
}

const AssignCourseToSectionForm = async ({ termId, sectionId }: AssignCourseToSectionFormProps) => {
  // 1️⃣ Get all term-level offerings
  const courses = await getTermCourses(termId)
  return (
    <div className="max-w-md space-y-4">
      {courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No courses available for this term.
        </p>
      ) : (
        
        <form action={assignCourseToSection as any} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />
          <select
            name="courseOfferingId"
            required
            className="w-full border rounded-md p-2"
          >
            <option value="">Select a course</option>
            {courses.map((offering) => (
              <option key={offering.id} value={offering.id}>
                {offering.course.name} ({offering.course.code})
              </option>
            ))}
          </select>

          <Button type="submit" className="w-full">
            Assign
          </Button>
        </form>
      )}
    </div>
    
  )
}

export default AssignCourseToSectionForm
