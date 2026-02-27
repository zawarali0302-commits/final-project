import StudentForm from "@/components/forms/student-form"
import { getDepartments } from "@/prisma/department.service"
import { getPrograms } from "@/prisma/program.service"
import { getTerms } from "@/prisma/term.service"
import { getSections } from "@/prisma/section.service"
import { getSessions } from "@/prisma/session.service"
import { getStudentById } from "@/prisma/student.service"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

interface UpdateStudentPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function UpdateStudentPage({
    params,
}: UpdateStudentPageProps) {
    const { id } = await params
    const student = await getStudentById(id)

    if (!student) notFound()

    const institute = await prisma.institute.findFirst()

    const departments = await getDepartments()
    const programs = await getPrograms()
    const terms = await getTerms()
    const sections = await getSections()
    const sessions = await getSessions()

    // Get current section from enrollment
    const currentEnrollment = student.studentEnrollments[0]

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">
                Update Existing Student
            </h1>

            <StudentForm
                instituteId={institute?.id}
                departments={departments}
                programs={programs}
                terms={terms}
                sections={sections}
                sessions={sessions}
                initialData={{
                    id: student.id,
                    name: student.name,
                    rollNo: student.rollNo,
                    gender: student.gender,
                    instituteId: student.instituteId,
                    programId: student.programId,
                    sessionId: student.sessionId,
                    status: student.status,
                    sectionId: currentEnrollment?.sectionId, // ✅ important
                }}
            />
        </div>
    )
}