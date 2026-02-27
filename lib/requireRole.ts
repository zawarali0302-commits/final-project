import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { UserRole } from "@/app/generated/prisma/enums"

export async function requireRole(allowedRoles: UserRole[]) {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    throw new Error("Unauthorized")
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  })

  if (!dbUser) {
    throw new Error("User not found in DB")
  }

  if (!allowedRoles.includes(dbUser.role)) {
    throw new Error("Forbidden")
  }

  return dbUser
}