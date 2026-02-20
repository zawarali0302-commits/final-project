import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseDropdown } from "@/components/dropdowns/course-dropdown"
import { getCourses } from "@/prisma/course.service"

export const metadata = {
  title: "Courses",
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Courses</CardTitle>
        <Button asChild>
          <Link href="/admin/courses/create">
            Add Course
          </Link>
        </Button>
      </CardHeader>
      <CardContent>


        {courses.length === 0 ? (
          <p className="text-muted-foreground">No courses found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.credits ?? "-"}</TableCell>
                  <TableCell>{course.department?.name}</TableCell>
                  <TableCell className="space-x-2">
                    <CourseDropdown courseId={course.id} departmentId={course.departmentId} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
