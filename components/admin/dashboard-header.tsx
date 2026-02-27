import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

const DashboardHeader = async () => {
  // 1️⃣ Get logged-in Clerk user
  const clerkUser = await currentUser()

  if (!clerkUser) {
    return <div>Not authenticated</div>
  }

  // 2️⃣ Find user in your DB using clerkId
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  if (!dbUser?.instituteId) {
    return <div>No institute found</div>
  }

  // 3️⃣ Find institute using instituteId
  const institute = await prisma.institute.findUnique({
    where: { id: dbUser.instituteId },
  })

  return (
    <div>
      <h2 className="text-2xl font-bold">
        {institute?.name ?? "Institute Name"}
      </h2>
      <p className="text-muted-foreground">
        Manage teachers, students, classes, and generate result cards.
      </p>
    </div>
  )
}

export default DashboardHeader