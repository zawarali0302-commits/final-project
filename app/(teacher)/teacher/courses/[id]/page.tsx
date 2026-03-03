import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CourseDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const CourseDetailPage = async ({ params }: CourseDetailPageProps) => {
  const { id } = await params

  const clerkUser = await currentUser()
  if (!clerkUser?.id) redirect("/sign-in")

  const email = clerkUser.emailAddresses[0].emailAddress
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      teacher: true,
    },
  })

  if (!user || user.role !== "TEACHER" || !user.teacher) redirect("/")

  // Route param is sectionCourse.id from /teacher/courses listing page.
  const sectionCourse = await prisma.sectionCourse.findFirst({
    where: {
      id,
      teacherId: user.teacher.id,
    },
    include: {
      section: true,
      courseOffering: {
        include: {
          term: {
            include: {
              program: true,
              academicYear: true,
            },
          },
          course: {
            include: {
              department: true,
            },
          },
          courseExams: {
            include: {
              examEvent: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  })

  if (!sectionCourse) notFound()

  const { courseOffering, section } = sectionCourse
  const exams = courseOffering.courseExams

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{courseOffering.course.name}</h1>
        <p className="text-muted-foreground">
          Course Code: {courseOffering.course.code} | Department:{" "}
          {courseOffering.course.department.name}
        </p>
        <p className="text-muted-foreground">
          Program: {courseOffering.term.program.name} | Academic Year:{" "}
          {courseOffering.term.academicYear.name} | Term: {courseOffering.term.name} |
          Section: {section.name}
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Exams</h2>

        {exams.length === 0 ? (
          <div className="mt-2 rounded-xl bg-muted p-4 text-muted-foreground">
            No exams created for this course offering yet.
          </div>
        ) : (
          <div className="mt-2 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const isLocked = exam.examEvent.isLocked
              return (
                <Card key={exam.id} className="transition hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>{exam.examEvent.type}</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Total Marks: {exam.totalMarks}</p>
                      <p>
                        Date:{" "}
                        {exam.date ? new Date(exam.date).toLocaleDateString() : "Not scheduled"}
                      </p>
                      <p>Status: {isLocked ? "Locked" : "Open"}</p>
                    </div>

                    <Button asChild className="w-full" disabled={isLocked}>
                      <Link href={`/teacher/exams/${exam.id}`}>
                        {isLocked ? "Locked" : "Enter Marks"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseDetailPage
