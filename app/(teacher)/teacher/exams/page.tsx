import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const TeacherExamsPage = async () => {
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
    include: { teacher: true },
  })

  if (!user || user.role !== "TEACHER" || !user.teacher) {
    redirect("/")
  }

  const exams = await prisma.courseExam.findMany({
    where: {
      courseOffering: {
        sectionCourses: {
          some: {
            teacherId: user.teacher.id,
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
              teacherId: user.teacher.id,
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

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Exams</h1>
        <p className="text-lg text-muted-foreground">
          Exams for courses assigned to you.
        </p>
      </div>

      {exams.length === 0 ? (
        <div className="rounded-xl bg-muted p-6 text-muted-foreground">
          No exams available yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const sectionNames = exam.courseOffering.sectionCourses
              .map((sc) => sc.section.name)
              .join(", ")

            return (
              <Card key={exam.id} className="transition hover:shadow-lg">
                <CardHeader>
                  <CardTitle>
                    {exam.courseOffering.course.name} ({exam.examEvent.type})
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Code: {exam.courseOffering.course.code}</p>
                    <p>Department: {exam.courseOffering.course.department.name}</p>
                    <p>Program: {exam.courseOffering.term.program.name}</p>
                    <p>Term: {exam.courseOffering.term.name}</p>
                    <p>Academic Year: {exam.courseOffering.term.academicYear.name}</p>
                    <p>Section(s): {sectionNames || "-"}</p>
                    <p>Total Marks: {exam.totalMarks}</p>
                    <p>
                      Date:{" "}
                      {exam.date ? new Date(exam.date).toLocaleDateString() : "Not scheduled"}
                    </p>
                    <p>Status: {exam.examEvent.isLocked ? "Locked" : "Open"}</p>
                    <p>Marks Entered: {exam._count.studentMarks}</p>
                  </div>

                  <Button asChild className="w-full" disabled={exam.examEvent.isLocked}>
                    <Link href={`/teacher/exams/${exam.id}`}>
                      {exam.examEvent.isLocked ? "Locked" : "Enter Marks"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TeacherExamsPage
