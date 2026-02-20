"use server"

import { addCourseToSection, addSectionCourseTeacher, removeCourseFromSection } from "@/prisma/sectionCourse.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const assignCourseToSection = async (formData: FormData) => {
  const sectionId = formData.get("sectionId") as string
  const courseOfferingId = formData.get("courseOfferingId") as string

  if (!sectionId || !courseOfferingId) {
    throw new Error("Missing sectionId or courseOfferingId")
  }

  await addCourseToSection(sectionId, courseOfferingId)
  redirect(`/admin/sections/${sectionId}`)
}

export const unassignCourseFromSection = async (formData: FormData) => {
  const sectionCourseId = formData.get("sectionCourseId") as string
  const sectionId = formData.get("sectionId") as string

  if (!sectionCourseId || !sectionId) return
  

  await removeCourseFromSection(sectionCourseId, sectionId)
  revalidatePath("/")
}

export const updateSectionCourseTeacher = async (formData: FormData) => {
  const sectionCourseId = formData.get("sectionCourseId") as string
  const teacherId = formData.get("teacherId") as string | null

  if (!sectionCourseId || !teacherId) {
    throw new Error("Missing sectionCourseId or teacherId")
  }

  await addSectionCourseTeacher(sectionCourseId, teacherId)
  revalidatePath("/")
}