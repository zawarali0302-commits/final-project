"use server"

import { currentUser } from "@clerk/nextjs/server"
import { InstituteType } from "../generated/prisma/enums"
import { createInstituteWithAdmin, editInstitute } from "@/prisma/institute.service"
import { revalidatePath } from "next/cache"

/**
 * Server action to create institute + admin
 */
export const createInstitute = async (data: FormData) => {
  const clerkUser = await currentUser()
  if (!clerkUser || !clerkUser.id) throw new Error("Not authenticated")

  const clerkId = clerkUser.id
  const email = clerkUser.emailAddresses[0]?.emailAddress
  if (!email) throw new Error("Clerk user does not have an email")

  const name = data.get("name") as string
  const type = data.get("type") as InstituteType
  const location = data.get("location") as string
  if (!name || !type || !location) throw new Error("All fields are required")

try {
  await createInstituteWithAdmin(name, type, location, email, clerkId)
  return {success: true, message: "Institute created successfully"}
} catch (error) {
  return {success: false, message: (error as Error).message}
}
}

export const updateInstitute = async (id: string, data: FormData) => {
  const name = data.get("name") as string
  const type = data.get("type") as InstituteType
  const location = data.get("location") as string

  try {
    await editInstitute(id, {
      name,
      type,
      location,
    })

    revalidatePath("/admin/settings")
    revalidatePath("/admin")
    revalidatePath("/super-admin/institutes")
    return { success: true, message: "Institute updated successfully" }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}