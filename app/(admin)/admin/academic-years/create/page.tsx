import AcademicYearForm from "@/components/forms/academic-year-form";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function CreateAcademicYearPage() {
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
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Create Academic Year</h1>
      <AcademicYearForm instituteId = {institute?.id} />
    </div>
  )
}