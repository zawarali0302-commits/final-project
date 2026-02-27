'use server'

import { addTeacher, editTeacher, removeTeacher } from "@/prisma/teacher.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const createTeacher = async (data: FormData) => {
  const name = data.get("name") as string
  const email = data.get("email") as string
  const designation = data.get("designation") as string
  const departmentId = data.get("departmentId") as string
  const instituteId = data.get("instituteId") as string

  try {
    await addTeacher(name, email, designation, departmentId, instituteId)
    revalidatePath("/admin/teachers")
    return { success: true, message: "Teacher created successfully" }
  } catch (error: any) {
    console.error("Error creating teacher:", error)
    return { success: false, message: error.message || "Failed to create teacher" }
  }
}

export const updateTeacher = async (id: string, data: FormData) => {
  const name = data.get("name") as string
  const email = data.get("email") as string
  const designation = data.get("designation") as string
  const departmentId = data.get("departmentId") as string

  try {
    await editTeacher(id, { name, email, designation, departmentId })
    revalidatePath("/admin/teachers")
    return { success: true, message: "Teacher updated successfully" }
  } catch (error) {
    return { success: false, message: "Faild to update teacher" }

  }
}

export const deleteTeacher = async (id: string) => {
  try {
    await removeTeacher(id)
    revalidatePath("/admin/teachers")
    return { success: true, message: "Section deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete section" }
  }
}
