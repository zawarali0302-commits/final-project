import { getProgramById } from "@/prisma/program.service"
import TermForm from "@/components/forms/term-form"

interface CreateTermPageProps {
  searchParams: Promise<{programId: string, academicYearId: string}>
}

export default async function CreateTermPage({ searchParams }: CreateTermPageProps) {
  const { programId } = await searchParams

  const program = await getProgramById(programId)
  if (!program) return <p>Program not specified</p>

  return (
    <div className="max-w-xl">
      <TermForm programId = {program.id} />
    </div>
  )
}
