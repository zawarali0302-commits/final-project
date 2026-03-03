import { deleteCourse } from "@/app/actions/course.actions"
import { deleteProgram } from "@/app/actions/program.actions"
import { AddProgramDialog } from "@/components/forms/add-program-dialog"
import { AddCourseDialog } from "@/components/forms/add-course-dialog"
import { AddTeacherDialog } from "@/components/forms/add-teacher-dialog"
import { StatCard } from "@/components/admin/stat-card"
import Dropdown from "@/components/dropdown"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDepartmentById } from "@/prisma/department.service"
import { Building, GraduationCap, LibraryBig, School } from "lucide-react"
import Link from "next/link"

interface DepartmentDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const DepartmentDetailPage = async ({ params }: DepartmentDetailPageProps) => {
  const { id } = await params
  const department = await getDepartmentById(id)

  if (!department) {
    return <p className="text-muted-foreground">Department not found</p>
  }

  const statData = [
    {
      title: "Programs",
      value: department.programs.length,
      icon: <School className="h-5 w-5" />,
    },
    {
      title: "Teachers",
      value: department.teachers.length,
      icon: <GraduationCap className="h-5 w-5" />,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{department.name}</h1>
          <p className="text-muted-foreground">
            Department overview and academic structure
          </p>
        </div>

        <Button asChild>
          <Link href={`/admin/departments/${id}/edit`}>
            Update Department
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        {statData.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={String(stat.value)}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Programs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Programs</CardTitle>
          <AddProgramDialog departmentId={id} />
        </CardHeader>

        <CardContent>
          {department.programs.length === 0 ? (
            <EmptyState
              title="No programs found"
              description="Create your first program under this department"
              action={<AddProgramDialog departmentId={id} triggerLabel="Add Program" />}
              icon={<Building />}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>System</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {department.programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={{
                          pathname: `/admin/programs/${program.id}`,
                          query: { departmentId: id }
                        }}
                        className="hover:underline"
                      >
                        {program.name}
                      </Link>
                    </TableCell>
                    <TableCell>{program.level}</TableCell>
                    <TableCell>{program.system}</TableCell>
                    <TableCell>
                      <Dropdown
                        id={program.id}
                        viewRoute={{
                          pathname: `/admin/programs/${program.id}`,
                          query: { departmentId: id }
                        }}
                        editRoute={{
                          pathname: `/admin/programs/${program.id}/edit`,
                          query: { departmentId: id }
                        }}
                        deleteAction={deleteProgram.bind(null, program.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Teachers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Teachers</CardTitle>
          <AddTeacherDialog
            instituteId={department.instituteId}
            departments={[{ id: department.id, name: department.name }]}
            defaultDepartmentId={department.id}
          />
        </CardHeader>

        <CardContent>
          {department.teachers.length === 0 ? (
            <EmptyState
              title="No teachers found"
              description="Add teachers to this department"
              action={
                <AddTeacherDialog
                  instituteId={department.instituteId}
                  departments={[{ id: department.id, name: department.name }]}
                  defaultDepartmentId={department.id}
                  triggerLabel="Add Teacher"
                />
              }
              icon={<GraduationCap />}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {department.teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      {teacher.name}
                    </TableCell>
                    <TableCell>{teacher.designation}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Courses</CardTitle>
          <AddCourseDialog departmentId={id} />
        </CardHeader>

        <CardContent>
          {department.courses.length === 0 ? (
            <EmptyState
              title="No course found"
              description="Add courses to this department"
              action={<AddCourseDialog departmentId={id} triggerLabel="Add Course" />}
              icon={<LibraryBig />}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {department.courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      {course.name}
                    </TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      <Dropdown
                        id={course.id}
                        viewRoute={{
                          pathname: `/admin/courses/${course.id}`,
                          query: { departmentId: id }
                        }}
                        editRoute={{
                          pathname: `/admin/courses/${course.id}/edit`,
                          query: { departmentId: id }
                        }}
                        deleteAction={deleteCourse.bind(null, course.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DepartmentDetailPage
