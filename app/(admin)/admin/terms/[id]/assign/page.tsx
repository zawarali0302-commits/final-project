import AssignCourseToTermForm from '@/components/forms/term-course-assign-form'
import { getCoursesByDepartment } from '@/prisma/course.service'
import { getTermById } from '@/prisma/term.service'

interface AssignCourseToTermProps {
    params: Promise<{ id: string }>
}

const AssignCourseToTerm = async ({ params }: AssignCourseToTermProps) => {
    const { id } = await params
    const term = await getTermById(id)

    if (!term) return <p>Term not found</p>

    const courses = await getCoursesByDepartment(term.program.departmentId)

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

            <AssignCourseToTermForm
                termId={term.id}
                courses={courses}
            />
        </div>
    )
}

export default AssignCourseToTerm
