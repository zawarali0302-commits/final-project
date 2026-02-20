import { SectionForm } from "@/components/forms/section-form"
import { getProgramById } from "@/prisma/program.service"
import { getSectionById } from "@/prisma/section.service"

interface EditSectionPageProps {
  params: Promise<{
    id: string
  }>
}
export default async function EditSectionPage({ params }: EditSectionPageProps) {
  const { id } = await params

  const section = await getSectionById(id)
  if (!section) return <p>Section not found</p>

  return (
    <div className="max-w-xl">
      <SectionForm
        termId={section.termId}
        initialData={{
          id: section.id,
          name: section.name,
        }}
      />
    </div>
  )
}
