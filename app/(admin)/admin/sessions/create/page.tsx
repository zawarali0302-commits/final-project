import SessionForm from "@/components/forms/session-form"
import prisma from "@/lib/prisma"
import { getProgramsByInstitute } from "@/prisma/program.service"
import { currentUser } from "@clerk/nextjs/server"


export default async function CreateSessionPage() {
    // 1️⃣ Get Clerk user
      const clerkUser = await currentUser()
      if (!clerkUser) return <div>Not authenticated</div>
    
      // 2️⃣ Get user in DB
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      })
      if (!dbUser?.instituteId) return <div>No institute found</div>
    
      // 3️⃣ Get all programs in that institute
      const instituteId = dbUser.instituteId
      const programs = await getProgramsByInstitute(instituteId)
  return (
    <SessionForm
      instituteId={instituteId}
      programs={programs}
    />
  )
}