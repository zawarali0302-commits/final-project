import { CourseForm } from "@/components/forms/course-form"
import { getCourseById } from "@/prisma/course.service"

interface EditCoursePageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: "Edit Course",
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
  const { id } = await params;

  const course = await getCourseById(id)

  if (!course) {
    return <p>Course not found</p>
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Edit Course</h1>

      <CourseForm
        departmentId={course.departmentId}
        initialData={{
          id: course.id,
          name: course.name,
          code: course.code,
          departmentId: course.departmentId
        }}
      />
    </div>
  )
}
