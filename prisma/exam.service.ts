"use server"

import prisma from "@/lib/prisma"

export const addExam = async (
    title: string,
    type: any,
    totalMarks: number,
    date: Date,
    sectionId: string,
    courseOfferingId: string
) => {

    await prisma.exam.create({
      data: {
        title,
        type,
        totalMarks,
        date,
        sectionId,
        courseOfferingId,
      },
    })
}