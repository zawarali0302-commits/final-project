import { UserRole } from "@/app/generated/prisma/enums"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireRole } from "@/lib/requireRole"
import Link from "next/link"
import { notFound } from "next/navigation"
import ResultCardsTable from "@/components/admin/result-cards-table"
import { getResultCardsEventByInstitute } from "@/prisma/result.service"

interface ResultCardsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ResultCardsPage({ params }: ResultCardsPageProps) {
  const { id } = await params
  const user = await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])

  if (!user.instituteId) {
    return <p>No institute found for current user.</p>
  }

  const examEvent = await getResultCardsEventByInstitute(id, user.instituteId)

  if (!examEvent) notFound()

  const tableRows = examEvent.results.map((result) => {
    const subjectRows = examEvent.courseExams.map((courseExam) => {
      const subjectName = courseExam.courseOffering.course.name
      const total = courseExam.totalMarks
      const obtained =
        courseExam.studentMarks.find((mark) => mark.studentId === result.studentId)
          ?.obtainedMarks ?? "-"
      return { subjectName, obtained, total }
    })

    return {
      id: result.id,
      studentId: result.studentId,
      studentName: result.student.name,
      rollNo: result.student.rollNo,
      obtainedMarks: result.obtainedMarks,
      totalMarks: result.totalMarks,
      percentage: result.percentage,
      grade: result.grade,
      gpa: result.gpa,
      isPublished: result.isPublished,
      subjectRows,
    }
  })

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Result Cards</h1>
          <p className="text-muted-foreground">
            {examEvent.program.department.institute.name} | {examEvent.program.name} |{" "}
            {examEvent.academicYear.name} | {examEvent.type}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/results">Back</Link>
        </Button>
      </div>

      {examEvent.results.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No computed results found for this event.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <ResultCardsTable rows={tableRows} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
