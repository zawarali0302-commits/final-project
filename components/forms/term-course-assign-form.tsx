import { assignCourseToTerm } from '@/app/actions/courseOffering.actions'
import { getCoursesByDepartment } from '@/prisma/course.service'
import { Button } from '../ui/button'
interface AssignCourseToTermFormProps {
  termId: string
  departmentId: string
}
const AssignCourseToTermForm = async ({termId, departmentId}: AssignCourseToTermFormProps) => {
  const courses = await getCoursesByDepartment(departmentId)
  return (
    <div>
      <form action={assignCourseToTerm}>
        <input type="hidden" name="termId" value={termId} />
        <input type="hidden" name="departmentId" value={departmentId} />
        <select name="courseId" className="w-full border rounded-md p-2">
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        {courses.map((course) => (
          <input key={course.id} type="hidden" name="courseIds" value={course.id} />
        ))}

        <Button type="submit">Assign</Button>
      </form>
    </div>
  )
}

export default AssignCourseToTermForm
