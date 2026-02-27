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
import Dropdown from "@/components/dropdown"
import { deleteCourse } from "@/app/actions/course.actions"
import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { getCoursesByInstituteId } from "@/prisma/course.service"

export const metadata = {
  title: "Courses",
}

export default async function CoursesPage() {
// 1️⃣ Get Clerk user
  const clerkUser = await currentUser()
  if (!clerkUser) return <div>Not authenticated</div>

  // 2️⃣ Get user in DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  })
  if (!dbUser?.instituteId) return <div>No institute found</div>

  // 3️⃣ Get all programs in that institute
  const courses = await getCoursesByInstituteId(dbUser.instituteId)  
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
                    <Dropdown
                      id={course.id} 
                      viewRoute={{
                        pathname: `/admin/courses/${course.id}`,
                        query: { departmentId: course.departmentId },
                      }} 
                      editRoute={{
                        pathname: `/admin/courses/${course.id}/edit`,
                        query: { departmentId: course.departmentId },
                      }} 
                      deleteAction={deleteCourse.bind(null, course.id)} />
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
