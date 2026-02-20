import { InstituteType } from "@/app/generated/prisma/enums"
import prisma from "@/lib/prisma"

export const getInstitutes = async () => {
    return await prisma.institute.findMany({
        include: {
            departments: true
        }
    })
}

export const getInstituteById = async (id: string) => {
    return await prisma.institute.findUnique({
        where: {
            id
        },
        include: {
            departments: true
        }
    })
}

export const updateInstitute = async (id: string, data: {
    name?: string
    type?: InstituteType
    location?: string
}) => {
    return await prisma.institute.update({
        where: {
            id
        },
        data
    })
}

export const addInstitute = async (data: {
    name: string
    type: InstituteType
    location: string
}) => {
    return await prisma.institute.create({
        data: {
            name: data.name,
            type: data.type,
            location: data.location,
        }
    })
}