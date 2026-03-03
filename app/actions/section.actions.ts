"use server"

import { addSection, editSection, removeSection } from "@/prisma/section.service"
import { getTermById } from "@/prisma/term.service"
import { revalidatePath } from "next/cache"


export const createSection = async (data: FormData) => {
  const name = data.get("name") as string
  const termId = data.get("termId") as string


  if (!name) {
    throw new Error("Section name is required")
  }

  if (!termId) {
    throw new Error("Term is required")
  }

  try {
    const term = await getTermById(termId)
    await addSection(
      name,
      termId
    )

    revalidatePath("/")
    return { success: true, message: "Section created successfully" }
  } catch (error) {
    return { success: false, message: "Failed to create section" }
  }
}


export const updateSection = async (id: string, data: FormData) => {
  const name = data.get("name") as string
  const termId = data.get("termId") as string
  const programId = data.get("programId") as string

  const term = await getTermById(termId)
  try {
    await editSection(id, {
      name,
      termId
    })
    revalidatePath(`/admin/terms/${termId}?programId=${term?.programId}`)
    return { success: true, message: "Section updated successfully" }
  } catch (error) {
    return { success: false, message: "Failed to update section" }
  }
}
export const deleteSection = async (id: string) => {
  try {
    await removeSection(id)
    revalidatePath("/")
    return { success: true, message: "Section deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete section" }
  }
}