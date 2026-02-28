"use server"

import { addExam } from "@/prisma/exam.service"
import { revalidatePath } from "next/cache"

export const createExam = async (data: FormData) => {
  const title = data.get("title") as string
  const type = data.get("type") as any
  const totalMarks = Number(data.get("totalMarks"))
  const date = new Date(data.get("date") as string)
  const sectionId = data.get("sectionId") as string
  const courseOfferingId = data.get("courseOfferingId") as string

  try {
    await addExam(
      title,
      type,
      totalMarks,
      date,
      sectionId,
      courseOfferingId,
    )

    revalidatePath(`/admin/sections/${sectionId}`)
    return { success: true, message: "Exam created successfully" }
  } catch (error) {
    return { success: false, message: "Failed to create exam" }
  }
}