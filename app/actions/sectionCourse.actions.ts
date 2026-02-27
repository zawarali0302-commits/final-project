"use server"

import { addCourseToSection, addSectionCourseTeacher, removeCourseFromSection } from "@/prisma/sectionCourse.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const assignCourseToSection = async (data: FormData) => {
  const sectionId = data.get("sectionId") as string
  const courseOfferingId = data.get("courseOfferingId") as string

  if (!sectionId || !courseOfferingId) {
    throw new Error("Missing sectionId or courseOfferingId")
  }

  try {
    await addCourseToSection(sectionId, courseOfferingId)
    revalidatePath(`/admin/sections/${sectionId}`)
    return {success: true, message: "Course assigned to section successfully"}
  } catch (error) {
    return {success: false, message: "Failed to assign course to section"}
  }
}


export const unassignCourseFromSection = async (data: FormData) => {
  const sectionCourseId = data.get("sectionCourseId") as string
  const sectionId = data.get("sectionId") as string

  if (!sectionCourseId || !sectionId) {
    return {
      success: false,
      message: "Missing required fields",
    }
  }

  try {
    await removeCourseFromSection(sectionCourseId, sectionId)

    // ✅ Revalidate ONLY this section page
    revalidatePath(`/admin/sections/${sectionId}`)

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

export const updateSectionCourseTeacher = async (formData: FormData) => {
  const sectionCourseId = formData.get("sectionCourseId") as string
  const teacherId = formData.get("teacherId") as string | null

  if (!sectionCourseId || !teacherId) {
    throw new Error("Missing sectionCourseId or teacherId")
  }

  try {
    await addSectionCourseTeacher(sectionCourseId, teacherId)
    revalidatePath("/")
    return {success: true, message: "Teacher assigned successfully"}
  } catch (error) {
    return {success: false, message: "Failed to assign teacher"}
    
  }
}