"use server"

import { UserRole } from "@/app/generated/prisma/enums"
import { requireRole } from "@/lib/requireRole"
import { getProgramById } from "@/prisma/program.service"
import {
    addTerm,
    editTerm,
    promoteAllStudentsToTargetTermByInstitute,
    removeTerm,
} from "@/prisma/term.service"
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

        revalidatePath("/")
        return { success: true, message: "Term created successfully" }
    } catch {
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
    } catch {
        return { success: false, message: "Failed to update term" }
    }
}

export const deleteTerm = async (id: string) => {
    try {
        await removeTerm(id)

        revalidatePath("/")
        return { success: true, message: "Term deleted successfully" }
    } catch {
        return { success: false, message: "Failed to delete term" }
    }
}

export const promoteAllStudentsToNextTerm = async (data: FormData) => {
    const sourceTermId = data.get("sourceTermId") as string
    const targetAcademicYearId = data.get("targetAcademicYearId") as string
    const targetTermId = data.get("targetTermId") as string
    const targetSectionId = data.get("targetSectionId") as string

    if (!sourceTermId || !targetAcademicYearId || !targetTermId || !targetSectionId) {
        return { success: false, message: "Academic year, term, and section are required" }
    }

    try {
        const user = await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])
        if (!user.instituteId) {
            return { success: false, message: "No institute found for current user" }
        }

        const result = await promoteAllStudentsToTargetTermByInstitute(
            sourceTermId,
            targetAcademicYearId,
            targetTermId,
            targetSectionId,
            user.instituteId
        )

        revalidatePath("/admin/terms")
        revalidatePath(`/admin/terms/${sourceTermId}`)
        revalidatePath("/admin/students")
        revalidatePath("/admin/results")

        return {
            success: true,
            message: `Promotion completed: ${result.studentsProcessed} students moved from ${result.sourceTermName} (${result.sourceAcademicYear}) to ${result.targetTermName} (${result.targetAcademicYear}). ${result.enrollmentsCreated} enrollments created.`,
        }
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to promote students",
        }
    }
}
