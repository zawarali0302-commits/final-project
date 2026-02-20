"use server"

import { addCourse, editCourse, removeCourse } from "@/prisma/course.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const createCourse = async (data: FormData) => {

    const name = data.get("name") as string
    const code = data.get("code") as string
    const credits = data.get("credits") as string
    const departmentId = data.get("departmentId") as string

    if (!name || !code || !departmentId) {
        throw new Error("All fields are required")
    }

    await addCourse({ name, code, credits: Number(credits), departmentId })

    redirect(`/admin/departments/${departmentId}`)
}

export const updateCourse = async (id: string, data: FormData) => {

    const name = data.get("name") as string
    const code = data.get("code") as string
    const credits = data.get("credits") as string
    const departmentId = data.get("departmentId") as string

    await editCourse(id, { name, code, credits: Number(credits), departmentId })
    redirect(`/admin/departments/${departmentId}`)
}


export const deleteCourse = async (id: string) => {
    await removeCourse(id)
    revalidatePath("/")
}