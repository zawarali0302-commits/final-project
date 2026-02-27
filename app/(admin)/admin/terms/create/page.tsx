import Link from "next/link"
import { getAcademicYearsByInstitute } from "@/prisma/academicYear.service"
import { getProgramById } from "@/prisma/program.service"
import TermForm from "@/components/forms/term-form"

interface CreateTermPageProps {
  searchParams: Promise<{ programId: string }>
}
export default async function CreateTermPage({ searchParams }: CreateTermPageProps) {
  const { programId } = await searchParams
  const program = await getProgramById(programId)
  if (!program) return <p>Program not found</p>

  const instituteId = program.department.instituteId

  const academicYears = await getAcademicYearsByInstitute(instituteId)

  if (academicYears.length === 0) {
    return (
      <div>
        <p className="mb-4 text-sm text-red-500">
          Please create an Academic Year before adding terms.
        </p>

        <Link
          href="/admin/academic-years/create"
          className="text-blue-600 underline"
        >
          Create Academic Year
        </Link>
      </div>
    )
  }

  return (
    <TermForm
      programId={programId}
      academicYears={academicYears}
    />
  )
}