import { getProgramById } from "@/prisma/program.service"
import { SectionForm } from "@/components/forms/section-form"
import { getTermById } from "@/prisma/term.service"

interface CreateSectionPageProps {
  searchParams: Promise<{termId: string }>
}

export default async function CreateSectionPage({ searchParams }: CreateSectionPageProps) {
  const { termId } = await searchParams
  const term = await getTermById(termId)
  if (!term) return <p>Term not specified</p>
  return (
    <div className="max-w-xl">
      <SectionForm
        termId={termId}
      />
    </div>
  )
}
