'use server'

import { addDepartment, editDepartment, removeDepartment } from "@/prisma/department.service"
import { revalidatePath } from "next/cache"

export const createDepartment = async (data: FormData) => {
  const name = data.get("name")?.toString().trim()
  const instituteId = data.get("instituteId")?.toString().trim()
  if (!name) {
    return { success: false, message: "Department name is required" }
  }
  if (!instituteId) {
    return { success: false, message: "Institute ID is required" }
  }
  try {
    await addDepartment(name, instituteId)

    revalidatePath("/admin/departments?instituteId=" + instituteId)

    return { success: true, message: "Department created successfully" }
  } catch (error) {
    return { success: false, message: "Something went wrong" }
  }
}


export const updateDepartment = async (
  id: string,
  data: FormData
) => {
  const name = data.get("name")?.toString().trim()

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
  try {
    await removeDepartment(id)

    revalidatePath("/")

    return { success: true, message: "Department deleted successfully" }
  } catch (error) {
    return { success: false, message: "Something went wrong" }
  }
}