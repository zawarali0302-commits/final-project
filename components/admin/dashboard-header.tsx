import prisma from "@/lib/prisma"
import { getInstituteById } from "@/prisma/institute.service"
import { getUserByClerkId } from "@/prisma/user.service"

const DashboardHeader = async () => {
  const dbUser = await getUserByClerkId()
  if (!dbUser?.instituteId) {
    return <div>No institute found</div>
  }

  // 3️⃣ Find institute using instituteId
  const institute = await getInstituteById(dbUser.instituteId)
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