'use server'

import { addProgram, editProgram, removeProgram } from "@/prisma/program.service"
import { ProgramLevel, ProgramSystem } from "../generated/prisma/client"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export const createProgram = async (data: FormData) => {
    const name = data.get("name") as string
    const level = data.get("level") as ProgramLevel
    const system = data.get("system") as ProgramSystem
    const departmentId = data.get("departmentId") as string

    await addProgram(name, level, system, departmentId)

    redirect(`/admin/departments/${departmentId}`)
    
}

export const updateProgram = async (id: string, data: FormData) => {
    const name = data.get("name") as string
    const level = data.get("level") as ProgramLevel
    const system = data.get("system") as ProgramSystem
    const departmentId = data.get("departmentId") as string

    await editProgram(id, {
        name,
        level,
        system,
        departmentId,
   })

    redirect(`/admin/departments/${departmentId}/programs`)
}

export const deleteProgram = async (id: string) => {
    await removeProgram(id)
    revalidatePath("/")
}