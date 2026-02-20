"use client"

import { updateSectionCourseTeacher } from "@/app/actions/sectionCourse.actions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Teacher {
  id: string
  name: string
}

interface SectionCourse {
  id: string
  teacherId: string | null
  teacher: {
    name: string
  } | null
  courseOffering: {
    course: {
      name: string
    }
  }
}

interface AssignTeachersFormProps {
  sectionId: string
  sectionCourses: SectionCourse[]
  teachers: Teacher[]
}

export default function AssignTeachersToSectionCoursesForm({
  sectionId,
  sectionCourses,
  teachers,
}: AssignTeachersFormProps) {
  if (sectionCourses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No courses assigned to this section.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Teacher</TableHead>
          <TableHead>Assign Teacher</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sectionCourses.map((sc) => (
          <TableRow key={sc.id}>
            <TableCell>
              {sc.courseOffering.course.name}
            </TableCell>

            <TableCell>
              {sc.teacher ? sc.teacher.name : "Not Assigned"}
            </TableCell>
            <TableCell>
              <form action={updateSectionCourseTeacher} className="flex items-center gap-2">
                <input
                  type="hidden"
                  name="sectionCourseId"
                  value={sc.id}
                />
                <input
                  type="hidden"
                  name="sectionId"
                  value={sectionId}
                />

                <select
                  name="teacherId"
                  defaultValue={sc.teacherId ?? ""}
                  className="border rounded-md p-2 text-sm"
                >
                  <option value="">Not Assigned</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>

                <Button size="sm" type="submit">
                  Save
                </Button>
              </form>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}