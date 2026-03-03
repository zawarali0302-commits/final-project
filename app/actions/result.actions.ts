"use server"

import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/requireRole"
import { UserRole } from "@/app/generated/prisma/enums"
import {
  computeResultsForExamEventByInstitute,
  setResultsPublishedForExamEventByInstitute,
} from "@/prisma/result.service"

export const computeResultsForExamEvent = async (examEventId: string) => {
  if (!examEventId) {
    return { success: false, message: "Exam event is required" }
  }

  try {
    const user = await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
    if (!user.instituteId) {
      return { success: false, message: "No institute found for current user" }
    }
    const { computedStudents } = await computeResultsForExamEventByInstitute(
      examEventId,
      user.instituteId
    )

    revalidatePath("/admin/results")
    revalidatePath("/admin")

    return {
      success: true,
      message: `Results computed for ${computedStudents} students.`,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to compute results",
    }
  }
}

export const setResultsPublishedForExamEvent = async (payload: {
  examEventId: string
  published: boolean
}) => {
  const { examEventId, published } = payload

  if (!examEventId) {
    return { success: false, message: "Exam event is required" }
  }

  try {
    const user = await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
    if (!user.instituteId) {
      return { success: false, message: "No institute found for current user" }
    }
    await setResultsPublishedForExamEventByInstitute(
      examEventId,
      user.instituteId,
      published
    )

    revalidatePath("/admin/results")
    revalidatePath("/admin")

    return {
      success: true,
      message: published
        ? "Results published successfully"
        : "Results unpublished successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update publish status",
    }
  }
}
