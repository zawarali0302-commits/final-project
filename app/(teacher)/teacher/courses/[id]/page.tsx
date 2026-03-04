import { currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserWithTeacherByEmail } from "@/prisma/user.service"
import { getSectionCourseDetailByTeacher } from "@/prisma/sectionCourse.service"

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
  const user = await getUserWithTeacherByEmail(email)

  if (!user || user.role !== "TEACHER" || !user.teacher) redirect("/")

  const sectionCourse = await getSectionCourseDetailByTeacher(id, user.teacher.id)

  if (!sectionCourse) notFound()

  const { courseOffering, section } = sectionCourse
  const exams = courseOffering.courseExams

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
          <h1 className="text-2xl font-semibold sm:text-3xl">{courseOffering.course.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
          Course Code: {courseOffering.course.code} | Department:{" "}
          {courseOffering.course.department.name}
          </p>
          <p className="text-sm text-muted-foreground">
            Program: {courseOffering.term.program.name} | Academic Year:{" "}
            {courseOffering.term.academicYear.name} | Term: {courseOffering.term.name} |
            Section: {section.name}
          </p>
        </div>
      </section>

      <div>
        <h2 className="text-xl font-semibold">Exams</h2>

        {exams.length === 0 ? (
          <div className="mt-3 rounded-2xl border bg-card p-4 text-sm text-muted-foreground shadow-sm">
            No exams created for this course offering yet.
          </div>
        ) : (
          <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const isLocked = exam.examEvent.isLocked
              return (
                <Card key={exam.id} className="border-border/70 bg-card/90 py-0 transition hover:-translate-y-1 hover:shadow-md">
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
