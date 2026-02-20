"use server"

import { addCourseToTerm } from "@/prisma/courseOffering.service"

export const assignCourseToTerm = async (data: FormData) => {
    const courseId = data.get("courseId") as string
    const termId = data.get("termId") as string

    await addCourseToTerm(courseId, termId)

}



