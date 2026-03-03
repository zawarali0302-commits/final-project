import { getDepartmentById } from "@/prisma/department.service"
import { DepartmentForm } from "@/components/forms/department-form"

interface EditDepartmentPageProps {
  params: Promise<{ id: string }>
}
export default async function EditDepartmentPage({ params }: EditDepartmentPageProps) {
  const { id } = await params
  const department = await getDepartmentById(id)

  if (!department) return null

  return (
    <div className="max-w-xl">
      <DepartmentForm
        instituteId={department.instituteId}
        initialData={department}
      />
    </div>
  )
}
