import StudentForm from "@/components/forms/student-form"
import { getDepartmentsByInstitute } from "@/prisma/department.service"
import { getProgramsByInstitute } from "@/prisma/program.service"
import { getSectionsByInstitute } from "@/prisma/section.service"
import { getSessionsByInstitute } from "@/prisma/session.service"
import { getTermsByInstitute } from "@/prisma/term.service"
import { getUserByClerkId } from "@/prisma/user.service"

export default async function CreateStudentPage() {
  const dbUser = await getUserByClerkId()

  if (!dbUser?.instituteId) {
    return <div>No institute found</div>
  }

  const departments = await getDepartmentsByInstitute(dbUser.instituteId)
  const programs = await getProgramsByInstitute(dbUser.instituteId)
  const terms = await getTermsByInstitute(dbUser.instituteId)
  const sections = await getSectionsByInstitute(dbUser.instituteId)
  const sessions = await getSessionsByInstitute(dbUser.instituteId)
  

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Student</h1>
      <StudentForm
        instituteId={dbUser.instituteId}
        departments={departments}
        programs={programs}
        terms={terms}
        sections={sections}
        sessions={sessions}
      />
    </div>
  )
}
