import { getDepartments } from "@/prisma/department.service"
import { getProgramById } from "@/prisma/program.service"
import { ProgramForm } from "@/components/forms/program-form"

interface EditProgramPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = await params
  const program = await getProgramById(id)
  if (!program) return null

  return (
    <div className="max-w-2xl">
      <ProgramForm
        departmentId={program.departmentId}
        initialData={{
          id: program.id,
          name: program.name,
          level: program.level,
          system: program.system,
          departmentId: program.departmentId,
        }}
      />
    </div>
  )
}
