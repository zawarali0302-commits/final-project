import { getDepartmentById } from "@/prisma/department.service"
import { ProgramForm } from "@/components/forms/program-form"
import { notFound } from "next/navigation"

interface CreateProgramPageProps {
  searchParams: Promise<{ 
    departmentId?: string
  }>
}
export default async function CreateProgramPage({ searchParams }: CreateProgramPageProps) {
  const { departmentId } = await searchParams

  if (!departmentId) {
    return <div className="p-6">Department not specified</div>
  }
  const department = await getDepartmentById(departmentId)

  if (!department) return notFound()

  return (
    <div className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Create Program</h1>
            <p className="text-muted-foreground">
             For the Department: {department.name}
            </p>
          </div>
    
          <ProgramForm departmentId = {department.id}/>
        </div>
  )
}
