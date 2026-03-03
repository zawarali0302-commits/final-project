'use server'

import { addProgram, editProgram, removeProgram } from "@/prisma/program.service"
import { ProgramLevel, ProgramSystem } from "../generated/prisma/client"
import { revalidatePath } from "next/cache"

export const createProgram = async (data: FormData) => {
    const name = data.get("name") as string
    const level = data.get("level") as ProgramLevel
    const system = data.get("system") as ProgramSystem
    const departmentId = data.get("departmentId") as string

    try {
        await addProgram(name, level, system, departmentId)

        revalidatePath("/")
        return { success: true, message: "Program created successfully" }
    } catch (error) {
        return { success: false, message: "Failed to create program" }
    }

}

export const updateProgram = async (id: string, data: FormData) => {
    const name = data.get("name") as string
    const level = data.get("level") as ProgramLevel
    const system = data.get("system") as ProgramSystem
    const departmentId = data.get("departmentId") as string

    try {
        await editProgram(id, {
            name,
            level,
            system,
            departmentId,
        })

        revalidatePath(`/admin/departments/${departmentId}/programs`)
        return { success: true, message: "Program updated successfully" }
    } catch (error) {
        return { success: false, message: "Failed to update program" }
    }
}

export const deleteProgram = async (id: string) => {
    try {
        await removeProgram(id)
        revalidatePath("/")
        return { success: true, message: "Program deleted successfully" }
    } catch (error) {
        return { success: false, message: "Failed to delete program" }
    }
}