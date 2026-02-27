import prisma from "@/lib/prisma"
import TeacherForm from "@/components/forms/teacher-form"
import { currentUser } from "@clerk/nextjs/server"
import { getDepartmentsByInstitute } from "@/prisma/department.service"


export default async function CreateTeacherPage() {
  // 1️⃣ Get Clerk user
  const clerkUser = await currentUser()
  if (!clerkUser) return <div>Not authenticated</div>

  // 2️⃣ Get user in DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  })
  if (!dbUser?.instituteId) return <div>No institute found</div>

  // 3️⃣ Get all programs in that institute
  const departments = await getDepartmentsByInstitute(dbUser.instituteId)
  const institute = await prisma.institute.findUnique({
    where: { id: dbUser.instituteId },
  })
  if (!institute) return <div>No institute found</div>
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Teacher</h1>
        <p className="text-muted-foreground">
          Add a new teacher to the institute
        </p>
      </div>

      <TeacherForm
        departments={departments}
        instituteId={institute.id}
      />
    </div>
  )
}
