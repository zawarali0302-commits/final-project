"use server"

import { addAcademicYear, removeAcademicYear, setActiveAcademicYear } from "@/prisma/academicYear.service"
import { revalidatePath } from "next/cache"

export const createAcademicYear = async (data: FormData) => {
  const name = data.get("name") as string
  const startDate = data.get("startDate") as string
  const endDate = data.get("endDate") as string
  const instituteId = data.get("instituteId") as string

  if (!name || !startDate || !endDate || !instituteId) {
    throw new Error("Missing required fields")
  }

  await addAcademicYear(name, new Date(startDate), new Date(endDate), instituteId)
}

export const setActiveYear = async (academicYearId: string, instituteId: string) => {
  await setActiveAcademicYear(academicYearId, instituteId)
}

export const deleteAcademicYear = async (id: string) => {
  await removeAcademicYear(id)

  revalidatePath("/")
}