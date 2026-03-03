"use server"

import prisma from "@/lib/prisma"
import type { ExamType } from "@/app/generated/prisma/client"

export const addExam = async (
    type: ExamType,
    totalMarks: number,
    date: Date | undefined,
    sectionId: string,
    courseOfferingId: string
) => {
    const sectionCourse = await prisma.sectionCourse.findUnique({
      where: {
        courseOfferingId_sectionId: {
          courseOfferingId,
          sectionId,
        },
      },
      include: {
        courseOffering: {
          include: {
            term: {
              select: {
                programId: true,
                academicYearId: true,
              },
            },
          },
        },
      },
    })

    if (!sectionCourse) {
      throw new Error("Selected course is not assigned to the selected section")
    }

    const { programId, academicYearId } = sectionCourse.courseOffering.term

    const examEvent = await prisma.examEvent.upsert({
      where: {
        programId_academicYearId_type: {
          programId,
          academicYearId,
          type,
        },
      },
      update: {},
      create: {
        programId,
        academicYearId,
        type,
      },
    })

    const existingCourseExam = await prisma.courseExam.findUnique({
      where: {
        examEventId_courseOfferingId: {
          examEventId: examEvent.id,
          courseOfferingId,
        },
      },
    })

    if (existingCourseExam) {
      throw new Error(
        "An exam already exists for this course in the selected exam event. That exam applies to all sections linked to this course offering."
      )
    }

    await prisma.courseExam.create({
      data: {
        examEventId: examEvent.id,
        totalMarks,
        date,
        courseOfferingId,
      },
    })
}
