'use server'

import { addDepartment, editDepartment, removeDepartment } from "@/prisma/department.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Get the institute ID from the prisma database


export const createDepartment = async (data: { name: string }) => {
  const name = data.name?.trim()
  if (!name) {
    return { success: false, message: "Department name is required" }
  }
  try {
    await addDepartment(name)

    revalidatePath("/admin/departments")

    return { success: true, message: "Department created successfully" }
  } catch (error) {
    return { success: false, message: "Something went wrong" }
  }
}


export const updateDepartment = async (
  id: string,
  data: { name: string }
) => {
  const name = data.name?.trim()

  if (!name) {
    return { success: false, message: "Department name is required" }
  }

  try {
    await editDepartment(id, { name })

    revalidatePath("/admin/departments")

    return {
      success: true,
      message: "Department updated successfully",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    }
  }
}
export const deleteDepartment = async (id: string) => {
  await removeDepartment(id)

  redirect("/admin/departments")
}