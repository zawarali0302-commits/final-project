import TeachersTable from "@/components/teachers-table"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import { getTeachersByInstituteId } from "@/prisma/teacher.service"
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"

const TeachersPage = async () => {
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
  
      const teachers = await getTeachersByInstituteId(
          dbUser.instituteId
      )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">
            Manage institute teaching staff
          </p>
        </div>

        <Link href="/admin/teachers/create">
          <Button>Add Teacher</Button>
        </Link>
      </div>

      <TeachersTable teachers={teachers} />
    </div>
  )
}

export default TeachersPage
