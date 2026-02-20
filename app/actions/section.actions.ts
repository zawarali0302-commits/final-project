"use server"

import { addSection, editSection, removeSection } from "@/prisma/section.service"
import { getTermById } from "@/prisma/term.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


export const createSection = async (data: FormData) => {
  const name = data.get("name") as string
  const termId = data.get("termId") as string
  const programId = data.get("programId") as string


  if (!name) {
    throw new Error("Section name is required")
  }

  if (!termId) {
    throw new Error("Term is required")
  }
  
  const term = await getTermById(termId)
  await addSection(
    name,
    termId
  )

  redirect(`/admin/terms/${termId}?programId=${term?.programId}`)
}


export const updateSection = async (id: string, data: FormData) => {
  const name = data.get("name") as string
  const termId = data.get("termId") as string
  const programId = data.get("programId") as string

  const term = await getTermById(termId)
  await editSection(id, {
    name,
    termId
  })

  redirect(`/admin/terms/${termId}?programId=${term?.programId}`)
}
export const deleteSection = async (id: string) => {  
  await removeSection(id)
  revalidatePath("/")
}