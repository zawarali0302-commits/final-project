"use server"

import { getProgramById } from "@/prisma/program.service"
import { addTerm, editTerm, removeTerm } from "@/prisma/term.service"
import { revalidatePath } from "next/cache"

export const createTerm = async (data: FormData) => {
    const name = data.get("name") as string
    const programId = data.get("programId") as string
    const academicYearId = data.get("academicYearId") as string

    if (!name || !programId || !academicYearId) {
        throw new Error("Missing required fields")
    }

    const program = await getProgramById(programId)
    if (!program) {
        throw new Error("Program not found")
    }

    try {
        await addTerm(name, programId, academicYearId)

        revalidatePath(`/admin/programs/${programId}?departmentId=${program?.departmentId}`)
        return { success: true, message: "Term created successfully" }
    } catch (error) {
        return { success: false, message: "Failed to create term" }
    }
}

export const updateTerm = async (id: string, data: FormData) => {
    const name = data.get("name") as string
    const programId = data.get("programId") as string
    const academicYearId = data.get("academicYearId") as string

    const program = await getProgramById(programId)
    if (!program) {
        throw new Error("Program not found")
    }

    try {
        await editTerm(id, {
            name,
            programId,
            academicYearId
        })
        revalidatePath(`/admin/programs/${programId}?departmentId=${program?.departmentId}`)
        return { success: true, message: "Term updated successfully" }
    } catch (error) {
        return { success: false, message: "Failed to update term" }
    }
}

export const deleteTerm = async (id: string) => {
    try {
        await removeTerm(id)

        revalidatePath("/")
        return { success: true, message: "Term deleted successfully" }
    } catch (error) {
        return { success: false, message: "Failed to delete term" }
    }
}