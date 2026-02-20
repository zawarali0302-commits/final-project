'use server'

import { addDepartment, editDepartment, removeDepartment} from "@/prisma/department.service"
import { redirect } from "next/navigation"

// Get the institute ID from the prisma database


export const createDepartment = async (data: FormData) => {
  const name = data.get("name") as string
  if (!name) {
    throw new Error("Department name is required")
  }


  await addDepartment(
    name,
  )

  redirect("/admin/departments")
}



interface UpdateDepartmentFormData {
  name?: string
  instituteId?: string
}

export const updateDepartment = async (id: string, data: FormData) => {
  const name = data.get("name")?.toString().trim()
  const instituteId = data.get("instituteId")?.toString()

  if (!name) {
    throw new Error("Department name is required")
  }

  // Call the update function
  await editDepartment(id, {
    name,
    instituteId,
  })

  redirect(`/admin/departments`)
}

export const deleteDepartment = async (id: string) => {
  await removeDepartment(id)

  redirect("/admin/departments")
}