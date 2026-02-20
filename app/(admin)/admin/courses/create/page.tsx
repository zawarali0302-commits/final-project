import { CourseForm } from "@/components/forms/course-form"
import { getDepartmentById, getDepartments } from "@/prisma/department.service"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Add Course",
}

interface CreateCoursePageProps {
  searchParams: Promise<{
    departmentId?: string
  }>
}
export default async function CreateCoursePage({ searchParams }: CreateCoursePageProps) {
  const { departmentId } = await searchParams

  if (!departmentId) {
    return <div className="p-6">Department not specified</div>
  }
  const department = await getDepartmentById(departmentId)

  if (!department) {
    return notFound()
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Add New Course</h1>
      <CourseForm departmentId={department.id} />
    </div>
  )
}
