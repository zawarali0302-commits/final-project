import { UserRole } from "@/app/generated/prisma/enums"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { requireRole } from "@/lib/requireRole"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getResultCardsEventByInstitute } from "@/prisma/result.service"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import DownloadResultCardsPdfButton from "@/components/admin/download-result-cards-pdf-button"

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

  const sortedResults = [...examEvent.results].sort((a, b) =>
    a.student.rollNo.localeCompare(b.student.rollNo, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  )
  const termNames = [
    ...new Set(examEvent.courseExams.map((item) => item.courseOffering.term.name)),
  ].join(", ")
  const subjects = examEvent.courseExams.map((courseExam) => courseExam.courseOffering.course.name)
  const pdfRows = sortedResults.map((result, index) => ({
    no: index + 1,
    rollNo: result.student.rollNo,
    name: result.student.name,
    marks: examEvent.courseExams.map((courseExam) => {
      return (
        courseExam.studentMarks.find((item) => item.studentId === result.studentId)
          ?.obtainedMarks ?? "-"
      )
    }),
    totalMark: result.totalMarks,
    obtainedMark: result.obtainedMarks,
  }))
  const eventLabel = `${examEvent.program.department.institute.name} | ${examEvent.program.name} | ${termNames} | ${examEvent.academicYear.name} | ${examEvent.type}`
  const safeExamType = examEvent.type.toLowerCase().replace(/\s+/g, "-")
  const safeAcademicYear = examEvent.academicYear.name.toLowerCase().replace(/\s+/g, "-")
  const fileName = `result-cards-${safeExamType}-${safeAcademicYear}.pdf`

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Result Cards</h1>
            <p className="text-sm text-muted-foreground">
              {examEvent.program.department.institute.name} | {examEvent.program.name} |{" "}
              {termNames} | {examEvent.academicYear.name} | {examEvent.type}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DownloadResultCardsPdfButton
              fileName={fileName}
              eventLabel={eventLabel}
              subjects={subjects}
              rows={pdfRows}
            />
            <Button asChild variant="outline">
              <Link href="/admin/results">Back</Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs font-medium uppercase text-muted-foreground">Computed</p>
              <p className="mt-1 text-2xl font-bold">{sortedResults.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Total Subjects
              </p>
              <p className="mt-1 text-2xl font-bold">{examEvent.courseExams.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Overall Total Marks
              </p>
              <p className="mt-1 text-2xl font-bold">
                {examEvent.courseExams.reduce((sum, item) => sum + item.totalMarks, 0)}
              </p>
            </CardContent>
          </Card>
        </div>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    {examEvent.courseExams.map((courseExam) => (
                      <TableHead key={courseExam.id}>
                        {courseExam.courseOffering.course.name}
                      </TableHead>
                    ))}
                    <TableHead>Total Mark</TableHead>
                    <TableHead>Obtained Mark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedResults.map((result, index) => (
                    <TableRow key={result.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{result.student.rollNo}</TableCell>
                      <TableCell>
                        <Link href={{
                          pathname: `/admin/result-card/`,
                          query: { studentId: result.studentId },
                        }}
                        className="hover:underline"
                        >
                          {result.student.name}
                        </Link>
                        </TableCell>
                      {examEvent.courseExams.map((courseExam) => {
                        const mark =
                          courseExam.studentMarks.find(
                            (item) => item.studentId === result.studentId
                          )?.obtainedMarks ?? "-"

                        return <TableCell key={`${result.id}-${courseExam.id}`}>{mark}</TableCell>
                      })}
                      <TableCell>{result.totalMarks}</TableCell>
                      <TableCell>{result.obtainedMarks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
