import { InstituteType, UserRole } from "@/app/generated/prisma/enums"
import prisma from "@/lib/prisma"

const normalizeText = (value: string) => value.trim().replace(/\s+/g, " ")
const normalizeEmail = (value: string) => value.trim().toLowerCase()
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const getInstitutes = async () => {
  return prisma.institute.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          departments: true,
          users: true,
          teachers: true,
          students: true,
        },
      },
    },
  })
}

export const getInstitutesPaginated = async (
  page: number,
  pageSize: number
) => {
  const currentPage = Math.max(1, Math.floor(page))
  const take = Math.max(1, Math.floor(pageSize))
  const skip = (currentPage - 1) * take

  const [institutes, total] = await Promise.all([
    prisma.institute.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    }),
    prisma.institute.count(),
  ])

  return { institutes, total }
}

export const getInstituteById = async (id: string) => {
  const instituteId = id.trim()
  if (!instituteId) {
    throw new Error("Institute ID is required")
  }

  return prisma.institute.findUnique({
    where: {
      id: instituteId,
    },
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
  const normalizedName = normalizeText(name)
  const normalizedLocation = normalizeText(location)
  const normalizedEmail = normalizeEmail(email)
  const normalizedClerkId = clerkId.trim()

  if (!normalizedName) {
    throw new Error("Institute name is required")
  }
  if (!normalizedLocation) {
    throw new Error("Institute location is required")
  }
  if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
    throw new Error("A valid admin email is required")
  }
  if (!normalizedClerkId) {
    throw new Error("Clerk ID is required")
  }

  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { clerkId: normalizedClerkId }],
      },
      select: { id: true },
    })

    if (existingUser) {
      throw new Error("A user with this email or clerk account already exists")
    }

    const institute = await tx.institute.create({
      data: {
        name: normalizedName,
        type,
        location: normalizedLocation,
        isActive: true,
      },
    })

    const user = await tx.user.create({
      data: {
        email: normalizedEmail,
        clerkId: normalizedClerkId,
        role: UserRole.ADMIN,
        instituteId: institute.id,
        isEmailVerified: false,
      },
    })

    return { institute, user }
  })
}

export const editInstitute = async (id: string, data: {
  name?: string
  type?: InstituteType
  location?: string
}) => {
  const instituteId = id.trim()
  if (!instituteId) {
    throw new Error("Institute ID is required")
  }

  const updateData: {
    name?: string
    type?: InstituteType
    location?: string
  } = {}

  if (data.name !== undefined) {
    const normalizedName = normalizeText(data.name)
    if (!normalizedName) {
      throw new Error("Institute name cannot be empty")
    }
    updateData.name = normalizedName
  }

  if (data.location !== undefined) {
    const normalizedLocation = normalizeText(data.location)
    if (!normalizedLocation) {
      throw new Error("Institute location cannot be empty")
    }
    updateData.location = normalizedLocation
  }

  if (data.type !== undefined) {
    updateData.type = data.type
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided to update")
  }

  return prisma.institute.update({
    where: {
      id: instituteId,
    },
    data: updateData,
  })
}
