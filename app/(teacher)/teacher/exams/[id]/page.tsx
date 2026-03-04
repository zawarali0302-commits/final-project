import { currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getUserWithTeacherByClerkIdOrEmail } from "@/prisma/user.service"
import {
  getStudentEnrollmentsForCourseOfferingSections,
  getTeacherExamDetailByExamId,
} from "@/prisma/exam.service"
import { submitTeacherExamMarks } from "@/app/actions/exam.actions"

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
  const user = await getUserWithTeacherByClerkIdOrEmail(clerkUser.id, email)

  if (!user || user.role !== "TEACHER" || !user.teacher) redirect("/")
  const teacherId = user.teacher.id

  const exam = await getTeacherExamDetailByExamId(id, teacherId)

  if (!exam) notFound()

  if (exam.courseOffering.sectionCourses.length === 0) redirect("/")

  const sectionIds = exam.courseOffering.sectionCourses.map((sc) => sc.sectionId)

  const enrollments = await getStudentEnrollmentsForCourseOfferingSections(
    exam.courseOfferingId,
    sectionIds
  )

  const marksByStudentId = new Map(
    exam.studentMarks.map((mark) => [mark.studentId, mark.obtainedMarks])
  )

  const action = submitTeacherExamMarks.bind(null, id, teacherId)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
          <h1 className="text-2xl font-semibold sm:text-3xl">Enter Marks</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {exam.courseOffering.course.name} ({exam.courseOffering.course.code}) |{" "}
            {exam.examEvent.type} | Total Marks: {exam.totalMarks}
          </p>
          <p className="text-sm text-muted-foreground">
            Program: {exam.courseOffering.term.program.name} | Academic Year:{" "}
            {exam.courseOffering.term.academicYear.name} | Term: {exam.courseOffering.term.name}
          </p>
        </div>
      </section>

      <Card className="border-border/70 py-0">
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
            <form action={action} className="space-y-4">
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
