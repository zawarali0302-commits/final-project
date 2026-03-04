"use server"

import { addExam } from "@/prisma/exam.service"
import { saveTeacherExamMarks } from "@/prisma/exam.service"
import type { ExamType } from "@/app/generated/prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const createExam = async (data: FormData) => {
  const type = data.get("type") as ExamType
  const totalMarks = Number(data.get("totalMarks"))
  const rawDate = data.get("date") as string
  const date = rawDate ? new Date(rawDate) : undefined
  const sectionId = data.get("sectionId") as string
  const courseOfferingId = data.get("courseOfferingId") as string

  if (!type || !sectionId || !courseOfferingId) {
    return { success: false, message: "Please fill all required fields" }
  }

  if (Number.isNaN(totalMarks) || totalMarks <= 0) {
    return { success: false, message: "Total marks must be greater than 0" }
  }

  if (date && Number.isNaN(date.getTime())) {
    return { success: false, message: "Please provide a valid exam date" }
  }

  try {
    await addExam(
      type,
      totalMarks,
      date,
      sectionId,
      courseOfferingId,
    )

    revalidatePath(`/admin/sections/${sectionId}`)
    return {
      success: true,
      message:
        "Exam created successfully. It will be used for all sections linked to this course offering.",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create exam",
    }
  }
}

export const submitTeacherExamMarks = async (
  examId: string,
  teacherId: string,
  formData: FormData
) => {
  const result = await saveTeacherExamMarks(examId, teacherId, formData)

  if (result.status === "no_access") {
    redirect("/")
  }

  if (result.status === "locked" || result.status === "invalid_marks") {
    redirect(`/teacher/exams/${examId}`)
  }

  revalidatePath(`/teacher/exams/${examId}`)
  redirect(`/teacher/exams/${examId}`)
}
