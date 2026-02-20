import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import TeacherForm from "@/components/forms/teacher-form"
import { getTeacherById } from "@/prisma/teacher.service"
import { getDepartments } from "@/prisma/department.service"

interface EditTeacherPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditTeacherPage({ params }: EditTeacherPageProps) {
  const { id } = await params

  // ⚠️ Replace with session-based instituteId later
  const institute = await prisma.institute.findFirst()
  if (!institute) return notFound()

  // 1️⃣ Get Teacher
  const teacher = await getTeacherById(id)

  if (!teacher || teacher.instituteId !== institute.id) {
    return notFound()
  }

  // 2️⃣ Get Departments
  const departments = await getDepartments()
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Teacher</h1>
        <p className="text-muted-foreground">
          Update teacher information
        </p>
      </div>

      <TeacherForm
        departments={departments}
        instituteId={institute.id}
        initialData={{
          id: teacher.id,
          name: teacher.name,
          email: teacher.email,
          designation: teacher.designation,
          departmentId: teacher.departmentId,
        }}
      />
    </div>
  )
}
