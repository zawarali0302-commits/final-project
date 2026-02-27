"use server"

import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { InstituteType } from "../generated/prisma/enums"
import { createInstituteWithAdmin, updateInstitute } from "@/prisma/institute.service"
import { success } from "zod"

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

export const editInstitute = async (id: string, data: FormData) => {
  const name = data.get("name") as string
  const type = data.get("type") as InstituteType
  const location = data.get("location") as string

  await updateInstitute(id, {
    name,
    type,
    location,
  })

  redirect("/super-admin/institutes")
}