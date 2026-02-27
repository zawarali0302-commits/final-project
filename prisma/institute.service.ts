import { InstituteType, UserRole } from "@/app/generated/prisma/enums"
import prisma from "@/lib/prisma"

export const getInstitutes = async () => {
  return await prisma.institute.findMany({
    include: {
      departments: true
    }
  })
}

export const getInstituteById = async (id: string) => {
  return await prisma.institute.findUnique({
    where: {
      id
    },
    include: {
      departments: true
    }
  })
}


/**
 * Creates an institute and an admin user in a single transaction
 */
export async function createInstituteWithAdmin(
  name: string,
  type: InstituteType,
  location: string,
  email: string,
  clerkId: string
) {
  return prisma.$transaction(async (tx) => {
    const institute = await tx.institute.create({
      data: { name, type, location, isActive: true },
    })

    const user = await tx.user.create({
      data: {
        email,
        clerkId,
        role: UserRole.ADMIN,
        instituteId: institute.id,
        isEmailVerified: true,
      },
    })

    return { institute, user }
  })
}

export const updateInstitute = async (id: string, data: {
  name?: string
  type?: InstituteType
  location?: string
}) => {
  return await prisma.institute.update({
    where: {
      id
    },
    data
  })
}
