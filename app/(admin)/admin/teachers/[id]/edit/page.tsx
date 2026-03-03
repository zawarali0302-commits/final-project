import { notFound } from "next/navigation"
import TeacherForm from "@/components/forms/teacher-form"
import { getTeacherById } from "@/prisma/teacher.service"
import { getDepartmentsByInstitute } from "@/prisma/department.service"
import { getUserByClerkId } from "@/prisma/user.service"

interface EditTeacherPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditTeacherPage({ params }: EditTeacherPageProps) {
  const { id } = await params

  const dbUser = await getUserByClerkId()
  if (!dbUser.instituteId) return notFound()

  const teacher = await getTeacherById(id)
  if (!teacher || teacher.instituteId !== dbUser.instituteId) {
    return notFound()
  }

  const departments = await getDepartmentsByInstitute(dbUser.instituteId)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Teacher</h1>
        <p className="text-muted-foreground">Update teacher information</p>
      </div>

      <TeacherForm
        departments={departments}
        instituteId={dbUser.instituteId}
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
