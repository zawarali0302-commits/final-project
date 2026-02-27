import StudentForm from "@/components/forms/student-form"
import prisma from "@/lib/prisma"
import { getDepartmentsByInstitute } from "@/prisma/department.service"
import { getProgramsByInstitute } from "@/prisma/program.service"
import { getSectionsByInstitute } from "@/prisma/section.service"
import { getSessionsByInstitute } from "@/prisma/session.service"
import { getTermsByInstitute } from "@/prisma/term.service"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function CreateStudentPage() {
      const clerkUser = await currentUser()
  
      if (!clerkUser) {
          return <div>Not authenticated</div>
      }
  
      const dbUser = await prisma.user.findUnique({
          where: { clerkId: clerkUser.id },
      })
  
      if (!dbUser?.instituteId) {
          return <div>No institute found</div>
      }

      const institute = await prisma.institute.findUnique({
        where: { id: dbUser.instituteId },
      })
      if (!institute) {
        return <div>No institute found</div>
      }
      const departments = await getDepartmentsByInstitute(institute.id)
      const programs = await getProgramsByInstitute(institute.id)
      const terms = await getTermsByInstitute(institute.id)
      const sections = await getSectionsByInstitute(institute.id)
      const sessions = await getSessionsByInstitute(dbUser.instituteId) 
  
  //      if (sessions.length === 0) {
  //   redirect(`/admin/sessions/create?programId=${programId}`)
  // }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Student</h1>
      <StudentForm
        instituteId={institute?.id}
        departments={departments}
        programs={programs}
        terms={terms}
        sections={sections}
        sessions={sessions}
      />
    </div>
  )
}