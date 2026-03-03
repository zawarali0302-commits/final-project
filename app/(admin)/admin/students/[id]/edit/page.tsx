import StudentForm from "@/components/forms/student-form"
import { getDepartmentsByInstitute } from "@/prisma/department.service"
import { getProgramsByInstitute } from "@/prisma/program.service"
import { getTermsByInstitute } from "@/prisma/term.service"
import { getSectionsByInstitute } from "@/prisma/section.service"
import { getSessionsByInstitute } from "@/prisma/session.service"
import { getStudentById } from "@/prisma/student.service"
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
    if (!student.instituteId) notFound()

    const departments = await getDepartmentsByInstitute(student.instituteId)
    const programs = await getProgramsByInstitute(student.instituteId)
    const terms = await getTermsByInstitute(student.instituteId)
    const sections = await getSectionsByInstitute(student.instituteId)
    const sessions = await getSessionsByInstitute(student.instituteId)

    // Get current section from enrollment
    const currentEnrollment = student.studentEnrollments[0]

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">
                Update Existing Student
            </h1>

            <StudentForm
                instituteId={student.instituteId}
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
