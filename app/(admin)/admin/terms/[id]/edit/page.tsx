import { getProgramById } from "@/prisma/program.service"
import TermForm from "@/components/forms/term-form"
import { getTermById } from "@/prisma/term.service"

interface EditTermPageProps {
    params: Promise<{ id: string }>
}

export default async function CreateTermPage({ params }: EditTermPageProps) {
    const { id } = await params

    const term = await getTermById(id)
    if (!term) return <p>Term not specified</p>

   const program = await getProgramById(term.programId)
    if (!program) return <p>Program not specified</p>

    return (
        <div className="max-w-xl">
            <TermForm programId={program.id} initialData={
                {
                    id: term.id,
                    name: term.name,
                    programId: term.programId,
                    academicYearId: term.academicYearId
                }
            }  />
        </div>
    )
}
