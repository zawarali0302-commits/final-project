"use server"

import { UserRole } from "@/app/generated/prisma/enums"
import { updateInstitute } from "@/prisma/institute.service"
import { requireRole } from "@/lib/requireRole"
import { revalidatePath } from "next/cache"

const ALLOWED_INSTITUTE_TYPES = ["SCHOOL", "COLLEGE", "UNIVERSITY"] as const
type AllowedInstituteType = (typeof ALLOWED_INSTITUTE_TYPES)[number]

const isAllowedInstituteType = (
  value: string
): value is AllowedInstituteType => {
  return ALLOWED_INSTITUTE_TYPES.includes(value as AllowedInstituteType)
}

export async function updateAdminInstituteProfile(data: FormData) {
  try {
    const authUser = await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])

    if (!authUser.instituteId) {
      return { success: false, message: "No institute found for this account." }
    }

    const name = String(data.get("name") ?? "").trim()
    const location = String(data.get("location") ?? "").trim()
    const type = String(data.get("type") ?? "").trim()

    if (!name || !location || !type) {
      return { success: false, message: "All profile fields are required." }
    }

    if (!isAllowedInstituteType(type)) {
      return { success: false, message: "Invalid institute type selected." }
    }

    await updateInstitute(authUser.instituteId, {
      name,
      location,
      type,
    })

    revalidatePath("/admin/settings")
    return { success: true, message: "Institute profile updated successfully." }
  } catch (error) {
    return { success: false, message: "Unable to update institute profile." }
  }
}
