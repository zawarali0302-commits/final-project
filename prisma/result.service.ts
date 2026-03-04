import { EnrollmentStatus } from "@/app/generated/prisma/enums"
import prisma from "@/lib/prisma"

type StudentAggregate = {
  obtainedMarks: number
  totalMarks: number
  studentEnrollmentId: string | null
}

function getGradeAndGpa(percentage: number) {
  if (percentage >= 85) return { grade: "A", gpa: 4.0 }
  if (percentage >= 80) return { grade: "A-", gpa: 3.7 }
  if (percentage >= 75) return { grade: "B+", gpa: 3.3 }
  if (percentage >= 70) return { grade: "B", gpa: 3.0 }
  if (percentage >= 65) return { grade: "C+", gpa: 2.7 }
  if (percentage >= 60) return { grade: "C", gpa: 2.0 }
  if (percentage >= 55) return { grade: "D+", gpa: 1.7 }
  if (percentage >= 50) return { grade: "D", gpa: 1.0 }
  return { grade: "F", gpa: 0.0 }
}

export const computeResultsForExamEventByInstitute = async (
  examEventId: string,
  instituteId: string
) => {
  const examEvent = await prisma.examEvent.findUnique({
    where: { id: examEventId },
    include: {
      program: {
        include: {
          department: true,
        },
      },
      courseExams: {
        include: {
          courseOffering: {
            include: {
              studentEnrollments: {
                where: {
                  status: EnrollmentStatus.ACTIVE,
                },
                include: {
                  student: true,
                },
              },
            },
          },
          studentMarks: true,
        },
      },
    },
  })

  if (!examEvent) {
    throw new Error("Exam event not found")
  }

  if (examEvent.program.department.instituteId !== instituteId) {
    throw new Error("You are not allowed to compute this exam event")
  }

  if (examEvent.courseExams.length === 0) {
    throw new Error("No course exams found in this exam event")
  }

  const aggregates = new Map<string, StudentAggregate>()
  let missingMarksCount = 0

  for (const courseExam of examEvent.courseExams) {
    const markByStudentId = new Map(
      courseExam.studentMarks.map((mark) => [mark.studentId, mark.obtainedMarks])
    )

    for (const enrollment of courseExam.courseOffering.studentEnrollments) {
      if (enrollment.student.programId !== examEvent.programId) {
        continue
      }

      const current = aggregates.get(enrollment.studentId) ?? {
        obtainedMarks: 0,
        totalMarks: 0,
        studentEnrollmentId: enrollment.id,
      }

      current.totalMarks += courseExam.totalMarks

      const obtained = markByStudentId.get(enrollment.studentId)
      if (typeof obtained !== "number") {
        missingMarksCount += 1
      } else {
        current.obtainedMarks += obtained
      }

      if (!current.studentEnrollmentId) {
        current.studentEnrollmentId = enrollment.id
      }

      aggregates.set(enrollment.studentId, current)
    }
  }

  if (aggregates.size === 0) {
    throw new Error("No enrolled students found for this exam event")
  }

  if (missingMarksCount > 0) {
    throw new Error(
      `Cannot compute results. ${missingMarksCount} student mark entries are missing.`
    )
  }

  const ops = Array.from(aggregates.entries()).map(([studentId, aggregate]) => {
    const percentage =
      aggregate.totalMarks > 0
        ? Number(((aggregate.obtainedMarks / aggregate.totalMarks) * 100).toFixed(2))
        : 0
    const { grade, gpa } = getGradeAndGpa(percentage)

    return prisma.result.upsert({
      where: {
        studentId_examEventId: {
          studentId,
          examEventId: examEvent.id,
        },
      },
      update: {
        totalMarks: aggregate.totalMarks,
        obtainedMarks: aggregate.obtainedMarks,
        percentage,
        grade,
        gpa,
        studentEnrollmentId: aggregate.studentEnrollmentId,
      },
      create: {
        studentId,
        examEventId: examEvent.id,
        totalMarks: aggregate.totalMarks,
        obtainedMarks: aggregate.obtainedMarks,
        percentage,
        grade,
        gpa,
        studentEnrollmentId: aggregate.studentEnrollmentId,
      },
    })
  })

  await prisma.$transaction(ops)
  return { computedStudents: aggregates.size }
}

export const setResultsPublishedForExamEventByInstitute = async (
  examEventId: string,
  instituteId: string,
  published: boolean
) => {
  const examEvent = await prisma.examEvent.findUnique({
    where: { id: examEventId },
    include: {
      program: {
        include: {
          department: true,
        },
      },
    },
  })

  if (!examEvent) {
    throw new Error("Exam event not found")
  }

  if (examEvent.program.department.instituteId !== instituteId) {
    throw new Error("You are not allowed to update this exam event")
  }

  const resultCount = await prisma.result.count({
    where: { examEventId },
  })

  if (resultCount === 0) {
    throw new Error("No computed results found for this exam event")
  }

  await prisma.result.updateMany({
    where: { examEventId },
    data: { isPublished: published },
  })

  return { updatedResults: resultCount }
}

export const getResultControlEventsByInstitute = async (instituteId: string) => {
  return prisma.examEvent.findMany({
    where: {
      program: {
        department: {
          instituteId,
        },
      },
    },
    include: {
      program: true,
      academicYear: true,
      results: {
        select: {
          isPublished: true,
        },
      },
      _count: {
        select: {
          courseExams: true,
          results: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export const getResultCardsEventByInstitute = async (
  examEventId: string,
  instituteId: string
) => {
  const examEvent = await prisma.examEvent.findUnique({
    where: { id: examEventId },
    include: {      
      program: {
        include: {
          department: {
            include: {
              institute: true,
            },
          },
        },
      },
      academicYear: true,
      results: {
        include: {
          student: {
            include: {
              session: true,
            },
          },
        },
        orderBy: {
          student: {
            rollNo: "asc",
          },
        },
      },
      courseExams: {
        include: {
          courseOffering: {
            include: {
              term: true,
              course: true,
            },
          },
          studentMarks: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  if (!examEvent) {
    return null
  }

  if (examEvent.program.department.instituteId !== instituteId) {
    return null
  }

  return examEvent
}
