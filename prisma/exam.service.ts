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

export const getTeacherExamsByTeacherId = async (teacherId: string) => {
  return prisma.courseExam.findMany({
    where: {
      courseOffering: {
        sectionCourses: {
          some: {
            teacherId,
          },
        },
      },
    },
    include: {
      examEvent: true,
      courseOffering: {
        include: {
          course: {
            include: {
              department: true,
            },
          },
          term: {
            include: {
              program: true,
              academicYear: true,
            },
          },
          sectionCourses: {
            where: {
              teacherId,
            },
            include: {
              section: true,
            },
          },
        },
      },
      _count: {
        select: {
          studentMarks: true,
        },
      },
    },
    orderBy: [
      { examEvent: { createdAt: "desc" } },
      { createdAt: "desc" },
    ],
  })
}

export const getTeacherExamDetailByExamId = async (
  examId: string,
  teacherId: string
) => {
  return prisma.courseExam.findUnique({
    where: { id: examId },
    include: {
      examEvent: true,
      courseOffering: {
        include: {
          course: {
            include: {
              department: true,
            },
          },
          term: {
            include: {
              program: true,
              academicYear: true,
            },
          },
          sectionCourses: {
            where: {
              teacherId,
            },
            include: {
              section: true,
            },
          },
        },
      },
      studentMarks: true,
    },
  })
}

export const getStudentEnrollmentsForCourseOfferingSections = async (
  courseOfferingId: string,
  sectionIds: string[]
) => {
  const studentEnrollments = await prisma.studentEnrollment.findMany({
    where: {
      courseOfferingId,
      sectionId: {
        in: sectionIds,
      },
    },
    include: {
      student: true,
    },
    orderBy: {
      student: {
        rollNo: "asc",
      },
    },
  })

  return studentEnrollments.sort((a, b) => a.student.rollNo.localeCompare(b.student.rollNo))
}

type SaveTeacherExamMarksResult =
  | { status: "ok" }
  | { status: "no_access" }
  | { status: "locked" }
  | { status: "invalid_marks" }

export const saveTeacherExamMarks = async (
  examId: string,
  teacherId: string,
  formData: FormData
): Promise<SaveTeacherExamMarksResult> => {
  const freshExam = await prisma.courseExam.findUnique({
    where: { id: examId },
    include: {
      examEvent: true,
      courseOffering: {
        include: {
          sectionCourses: {
            where: {
              teacherId,
            },
          },
        },
      },
    },
  })

  if (!freshExam || freshExam.courseOffering.sectionCourses.length === 0) {
    return { status: "no_access" }
  }

  if (freshExam.examEvent.isLocked) {
    return { status: "locked" }
  }

  const allowedSectionIds = freshExam.courseOffering.sectionCourses.map(
    (sc) => sc.sectionId
  )
  const freshEnrollments = await prisma.studentEnrollment.findMany({
    where: {
      courseOfferingId: freshExam.courseOfferingId,
      sectionId: {
        in: allowedSectionIds,
      },
    },
    select: {
      studentId: true,
    },
  })

  const updates = []
  for (const enrollment of freshEnrollments) {
    const raw = formData.get(`marks_${enrollment.studentId}`)
    if (typeof raw !== "string" || raw.trim() === "") {
      continue
    }

    const obtainedMarks = Number(raw)
    if (
      Number.isNaN(obtainedMarks) ||
      obtainedMarks < 0 ||
      obtainedMarks > freshExam.totalMarks
    ) {
      return { status: "invalid_marks" }
    }

    updates.push(
      prisma.studentMark.upsert({
        where: {
          studentId_courseExamId: {
            studentId: enrollment.studentId,
            courseExamId: freshExam.id,
          },
        },
        update: {
          obtainedMarks,
        },
        create: {
          studentId: enrollment.studentId,
          courseExamId: freshExam.id,
          obtainedMarks,
        },
      })
    )
  }

  if (updates.length > 0) {
    await prisma.$transaction(updates)
  }

  return { status: "ok" }
}
