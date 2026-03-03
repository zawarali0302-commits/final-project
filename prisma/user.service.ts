import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export const getUserByClerkId = async () => {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    throw new Error("User not authenticated")
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  if (!dbUser) {
    throw new Error("User not found in database")
  }



  return dbUser
}

