"use server"

import { addAcademicYear, editAcademicYear, removeAcademicYear, setActiveAcademicYear } from "@/prisma/academicYear.service"
import { revalidatePath } from "next/cache"


export const createAcademicYear = async (data: FormData) => {
  const name = data.get("name") as string
  const instituteId = data.get("instituteId") as string

  if (!name || !instituteId) {
    throw new Error("Missing required fields")
  }

  // Optional: auto-generate dates
  const startDate = new Date(`${name.split("-")[0]}-01-01`)
  const endDate = new Date(`${name.split("-")[1]}-12-31`)

   try {
    await addAcademicYear(
     name,
     startDate,
     endDate,
     instituteId
   )
   return { success: true, message: "Academic year created successfully" }
   } catch (error) {
     return { success: false, message: "Somthing went wrong" }
   }
}

export const updateAcademicYear = async (id: string, data: FormData) => {
  const name = data.get("name") as string
  const startDate = new Date(data.get("startDate") as string)
  const endDate = new Date(data.get("endDate") as string)
  const instituteId = data.get("instituteId") as string

  if (!name || !instituteId) {
    throw new Error("Missing required fields")
  }

  try {
    await editAcademicYear(
      id,
      name,
      startDate,
      endDate,
      instituteId
    )
    return { success: true, message: "Academic year updated successfully" }
  } catch (error) {
    return { success: false, message: "Somthing went wrong" }
  }
}

export const setActiveYear = async (academicYearId: string, instituteId: string) => {
  await setActiveAcademicYear(academicYearId, instituteId)
}

export const deleteAcademicYear = async (id: string) => {
  await removeAcademicYear(id)

  revalidatePath("/")
}