import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EnterMarksPageProps {
  params: Promise<{
    id: string
  }>
}

const EnterMarksPage = async ({ params }: EnterMarksPageProps) => {
  const { id } = await params

  const clerkUser = await currentUser()
  if (!clerkUser?.id) redirect("/sign-in")

  const email = clerkUser.emailAddresses[0]?.emailAddress
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { clerkId: clerkUser.id },
        ...(email ? [{ email }] : []),
      ],
    },
    include: {
      teacher: true,
    },
  })

  if (!user || user.role !== "TEACHER" || !user.teacher) redirect("/")

  const exam = await prisma.courseExam.findUnique({
    where: { id },
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
              teacherId: user.teacher.id,
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

  if (!exam) notFound()

  if (exam.courseOffering.sectionCourses.length === 0) redirect("/")

  const sectionIds = exam.courseOffering.sectionCourses.map((sc) => sc.sectionId)

  const enrollments = await prisma.studentEnrollment.findMany({
    where: {
      courseOfferingId: exam.courseOfferingId,
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

  const marksByStudentId = new Map(
    exam.studentMarks.map((mark) => [mark.studentId, mark.obtainedMarks])
  )

  const saveMarks = async (formData: FormData) => {
    "use server"

    const freshExam = await prisma.courseExam.findUnique({
      where: { id },
      include: {
        examEvent: true,
        courseOffering: {
          include: {
            sectionCourses: {
              where: {
                teacherId: user.teacher!.id,
              },
            },
          },
        },
      },
    })

    if (!freshExam || freshExam.courseOffering.sectionCourses.length === 0) {
      redirect("/")
    }

    if (freshExam.examEvent.isLocked) {
      redirect(`/teacher/exams/${id}`)
    }

    const allowedSectionIds = freshExam.courseOffering.sectionCourses.map((sc) => sc.sectionId)
    const freshEnrollments = await prisma.studentEnrollment.findMany({
      where: {
        courseOfferingId: freshExam.courseOfferingId,
        sectionId: {
          in: allowedSectionIds,
        },
      },
      include: {
        student: true,
      },
    })

    const updates = []
    for (const enrollment of freshEnrollments) {
      const raw = formData.get(`marks_${enrollment.studentId}`)
      if (typeof raw !== "string" || raw.trim() === "") {
        continue
      }

      const obtainedMarks = Number(raw)
      if (Number.isNaN(obtainedMarks) || obtainedMarks < 0 || obtainedMarks > freshExam.totalMarks) {
        redirect(`/teacher/exams/${id}`)
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

    revalidatePath(`/teacher/exams/${id}`)
    redirect(`/teacher/exams/${id}`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enter Marks</h1>
        <p className="text-muted-foreground">
          {exam.courseOffering.course.name} ({exam.courseOffering.course.code}) |{" "}
          {exam.examEvent.type} | Total Marks: {exam.totalMarks}
        </p>
        <p className="text-muted-foreground">
          Program: {exam.courseOffering.term.program.name} | Academic Year:{" "}
          {exam.courseOffering.term.academicYear.name} | Term: {exam.courseOffering.term.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Students ({enrollments.length}) {exam.examEvent.isLocked ? "- Locked" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No enrolled students found for your assigned section(s).
            </p>
          ) : (
            <form action={saveMarks} className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>{enrollment.student.rollNo}</TableCell>
                      <TableCell>{enrollment.student.name}</TableCell>
                      <TableCell className="max-w-32">
                        <Input
                          type="number"
                          name={`marks_${enrollment.studentId}`}
                          defaultValue={marksByStudentId.get(enrollment.studentId) ?? ""}
                          min={0}
                          max={exam.totalMarks}
                          step="0.01"
                          disabled={exam.examEvent.isLocked}
                          required
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button type="submit" className="w-full" disabled={exam.examEvent.isLocked}>
                {exam.examEvent.isLocked ? "Exam Is Locked" : "Save Marks"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default EnterMarksPage
