"use server"

import { addCourse, editCourse, removeCourse } from "@/prisma/course.service"
import { revalidatePath } from "next/cache"

export const createCourse = async (data: FormData) => {

    const name = data.get("name") as string
    const code = data.get("code") as string
    const credits = data.get("credits") as string
    const departmentId = data.get("departmentId") as string

    if (!name || !code || !departmentId) {
        throw new Error("All fields are required")
    }

    try {
        await addCourse({ name, code, credits: Number(credits), departmentId })

        revalidatePath("/")
        return { success: true, message: "Course created successfully" }
    } catch (error) {
        return { success: false, message: "Failed to create course" }
    }
}

export const updateCourse = async (id: string, data: FormData) => {

    const name = data.get("name") as string
    const code = data.get("code") as string
    const credits = data.get("credits") as string
    const departmentId = data.get("departmentId") as string

    try {
        await editCourse(id, { name, code, credits: Number(credits), departmentId })
        revalidatePath(`/admin/departments/${departmentId}`)
        return { success: true, message: "Course updated successfully" }
    } catch (error) {
        return { success: false, message: "Failed to update course" }
    }
}


export const deleteCourse = async (id: string) => {
    try {
        await removeCourse(id)
        revalidatePath("/")
        return { success: true, message: "Course deleted successfully" }
    } catch (error) {
        return { success: false, message: "Failed to delete course" }
    }
}