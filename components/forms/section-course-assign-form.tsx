"use client"

import { Button } from '../ui/button'
import { assignCourseToSection } from '@/app/actions/sectionCourse.actions'
import { useServerAction } from '@/hook/useServerAction'

interface AssignCourseToSectionFormProps {
  sectionId: string
  termCourses: {
    id: string
    course: {
      name: string
      code: string
    }
  }[]
}

const AssignCourseToSectionForm = ({
  sectionId,
  termCourses,
}: AssignCourseToSectionFormProps) => {

  const { execute, isPending } = useServerAction(assignCourseToSection)

  return (
    <div className="max-w-md space-y-4">
      {termCourses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No courses available for this term.
        </p>
      ) : (
        <form action={execute} className="space-y-3">
          <input type="hidden" name="sectionId" value={sectionId} />

          <select
            name="courseOfferingId"
            required
            className="w-full border rounded-md p-2"
          >
            <option value="">Select a course</option>

            {termCourses.map((offering) => (
              <option key={offering.id} value={offering.id}>
                {offering.course.name} ({offering.course.code})
              </option>
            ))}
          </select>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Assigning..." : "Assign"}
          </Button>
        </form>
      )}
    </div>
  )
}

export default AssignCourseToSectionForm