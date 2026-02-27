"use client"

import { assignCourseToTerm } from "@/app/actions/courseOffering.actions"
import { Button } from "../ui/button"
import { useServerAction } from "@/hook/useServerAction"

interface AssignCourseToTermFormProps {
  termId: string
  courses: {
    id: string
    name: string
  }[]
}

const AssignCourseToTermForm = ({
  termId,
  courses,
}: AssignCourseToTermFormProps) => {
  const { execute, isPending } = useServerAction(assignCourseToTerm)

  return (
    <div className="max-w-md space-y-4">
      <form action={execute} className="space-y-3">
        <input type="hidden" name="termId" value={termId} />

        <select
          name="courseId"
          required
          className="w-full border rounded-md p-2"
        >
          <option value="">Select course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Assigning..." : "Assign"}
        </Button>
      </form>
    </div>
  )
}

export default AssignCourseToTermForm