import { currentUser } from "@clerk/nextjs/server"
import { UserRole } from "@/app/generated/prisma/enums"
import prisma from "@/lib/prisma"

type AuthUser = {
  id: string
  clerkId: string | null
  email: string
  role: UserRole
  instituteId: string | null
}

function isSuperAdminRole(role: unknown) {
  const value = String(role ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]/g, "-")

  return value === "super-admin" || value === "superadmin"
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const clerkUser = await currentUser()
  if (!clerkUser) throw new Error("Unauthorized")

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses?.[0]?.emailAddress
  if (!email) throw new Error("User email not found")

  let dbUser = await prisma.user.findUnique({ where: { clerkId: clerkUser.id } })
  if (!dbUser) dbUser = await prisma.user.findUnique({ where: { email } })

  if (!dbUser) {
    const allowMetadataSuperAdmin =
      allowedRoles.includes(UserRole.SUPER_ADMIN) &&
      isSuperAdminRole(clerkUser.publicMetadata?.role)

    if (allowMetadataSuperAdmin) {
      return {
        id: clerkUser.id,
        clerkId: clerkUser.id,
        email,
        role: UserRole.SUPER_ADMIN,
        instituteId: null,
      }
    }

    throw new Error("User not found in DB")
  }

  if (!dbUser.clerkId) {
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { clerkId: clerkUser.id },
    })
  }

  if (!allowedRoles.includes(dbUser.role)) throw new Error("Forbidden")

  return {
    id: dbUser.id,
    clerkId: dbUser.clerkId ?? clerkUser.id,
    email: dbUser.email,
    role: dbUser.role,
    instituteId: dbUser.instituteId,
  }
}
