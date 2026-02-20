"use server"

import { getProgramById } from "@/prisma/program.service"
import { addTerm, editTerm, removeTerm } from "@/prisma/term.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const createTerm = async (data: FormData) => {
    const name = data.get("name") as string
    const programId = data.get("programId") as string
    const academicYearId = data.get("academicYearId") as string

    if (!name || !programId || !academicYearId) {
        throw new Error("Missing required fields")
    }

    const program = await getProgramById(programId)


    await addTerm(name, programId, academicYearId)

    redirect(`/admin/programs/${programId}?departmentId=${program?.departmentId}`)
}

export const updateTerm = async (id: string, data: FormData) => {
    const name = data.get("name") as string
    const programId = data.get("programId") as string
    const academicYearId = data.get("academicYearId") as string

    
    await editTerm(id, {
        name,
        programId,
        academicYearId
    })
}

export const deleteTerm = async (id: string) => {
    await removeTerm(id)

    revalidatePath("/")
}