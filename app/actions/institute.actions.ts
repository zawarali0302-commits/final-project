"use server"

import { addInstitute, updateInstitute } from "@/prisma/institute.service"
import { redirect } from "next/navigation"
import { InstituteType } from "../generated/prisma/enums"

export const createInstitute = async (data: FormData) => {
    const name = data.get("name") as string
    const type = data.get("type") as InstituteType
    const location = data.get("location") as string
    const establishedYear = data.get("establishedYear") as string

    await addInstitute({
        name,
        type,
        location,
    })

    redirect("/super-admin/institutes")
}

export const editInstitute = async (id: string, data: FormData) => {
    const name = data.get("name") as string
    const type = data.get("type") as InstituteType
    const location = data.get("location") as string
    const establishedYear = data.get("establishedYear") as string

    await updateInstitute(id, {
        name,
        type,
        location,
    })

    redirect("/super-admin/institutes")
}