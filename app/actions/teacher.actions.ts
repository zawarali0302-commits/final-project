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

    await addTeacher( name, email, designation, departmentId, instituteId)
  redirect("/admin/teachers")
}

export const updateTeacher = async (id: string, data: FormData) => {
  const name = data.get("name") as string
  const email = data.get("email") as string
  const designation = data.get("designation") as string
  const departmentId = data.get("departmentId") as string

  await editTeacher(id, { name, email, designation, departmentId })
  redirect("/admin/teachers")
}

export const deleteTeacher = async (id: string) => {
  await removeTeacher(id)
  revalidatePath("/admin/teachers")
}
