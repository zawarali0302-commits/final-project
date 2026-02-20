import TermCourseAssignFormRHF from '@/components/forms/term-course-assign-form'
import { getTermById } from '@/prisma/term.service'

interface AssignCourseToTermProps {
    params: Promise<{ id: string }> 
}

const AssignCourseToTerm = async ({ params }: AssignCourseToTermProps) => {
    const { id } = await params
    const term = await getTermById(id)

    if (!term) return <p>Term not found</p>

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{term.name}</h1>
                    <p className="text-gray-600">
                        Program: {term.program.name} | Academic Year: {term.academicYear.name}
                    </p>
                </div>
            </div>

            <TermCourseAssignFormRHF
                termId={term.id}
                departmentId={term.program.departmentId}
            />
        </div>
    )
}

export default AssignCourseToTerm
