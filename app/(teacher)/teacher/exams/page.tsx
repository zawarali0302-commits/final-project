import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getUserWithTeacherByClerkIdOrEmail } from "@/prisma/user.service"
import { getTeacherExamsByTeacherId } from "@/prisma/exam.service"

const TeacherExamsPage = async () => {
  const clerkUser = await currentUser()
  if (!clerkUser?.id) redirect("/sign-in")

  const email = clerkUser.emailAddresses[0]?.emailAddress
  const user = await getUserWithTeacherByClerkIdOrEmail(clerkUser.id, email)

  if (!user || user.role !== "TEACHER" || !user.teacher) {
    redirect("/")
  }

  const exams = await getTeacherExamsByTeacherId(user.teacher.id)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
          <h1 className="text-2xl font-semibold sm:text-3xl">My Exams</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Exams for courses assigned to you.
          </p>
        </div>
      </section>

      {exams.length === 0 ? (
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground shadow-sm">
          No exams available yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => {
            const sectionNames = exam.courseOffering.sectionCourses
              .map((sc) => sc.section.name)
              .join(", ")

            return (
              <Card key={exam.id} className="border-border/70 bg-card/90 py-0 transition hover:-translate-y-1 hover:shadow-md">
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
