"use server"

import { addCourseToTerm, removeCourseFromTerm } from "@/prisma/courseOffering.service"
import { revalidatePath } from "next/cache"

export const assignCourseToTerm = async (data: FormData) => {
    const courseId = data.get("courseId") as string
    const termId = data.get("termId") as string

    try {
        await addCourseToTerm(courseId, termId)
        revalidatePath(`/admin/terms/${termId}`)
        return { success: true, message: "Course assigned to term successfully" }
    } catch (error) {
        return { success: false, message: "Failed to assign course to term" }
    }
}

export const unassignCourseFromTerm = async (data: FormData) => {
  const courseOfferingId = data.get("courseOfferingId") as string
  const termId = data.get("termId") as string

  if (!courseOfferingId || !termId) {
    return {
      success: false,
      message: "Missing required fields",
    }
  }

  try {
    await removeCourseFromTerm(courseOfferingId, termId)

    // revalidate correct page
    revalidatePath("/")

    return {
      success: true,
      message: "Course unassigned successfully",
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      message: "Failed to unassign course",
    }
  }
}



