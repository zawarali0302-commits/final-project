import Link from "next/link"
import { notFound } from "next/navigation"
import { UserRole } from "@/app/generated/prisma/enums"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { requireRole } from "@/lib/requireRole"
import prisma from "@/lib/prisma"
import DownloadResultCard from "@/components/admin/download-result-card"

interface ResultCardProps {
  searchParams: Promise<{
    studentId?: string
  }>
}

const getGradeAndGpa = (percentage: number) => {
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

const ResultCard = async ({ searchParams }: ResultCardProps) => {
  const { studentId } = await searchParams
  const user = await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])

  if (!user.instituteId) {
    return <p>No institute found for current user.</p>
  }

  if (!studentId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Student is required to view transcript.</p>
        <Button asChild variant="outline">
          <Link href="/admin/results">Back</Link>
        </Button>
      </div>
    )
  }

  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
      instituteId: user.instituteId,
    },
    include: {
      institute: true,
      session: true,
      program: true,
      studentEnrollments: {
        include: {
          section: {
            include: {
              term: true,
            },
          },
        },
      },
      results: {
        include: {
          examEvent: {
            include: {
              academicYear: true,
              courseExams: {
                include: {
                  courseOffering: {
                    include: {
                      term: true,
                      course: true,
                    },
                  },
                  studentMarks: {
                    where: {
                      studentId,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  if (!student) notFound()

  const totalMarks = student.results.reduce((sum, item) => sum + item.totalMarks, 0)
  const obtainedMarks = student.results.reduce((sum, item) => sum + item.obtainedMarks, 0)
  const overallPercentage = totalMarks > 0 ? Number(((obtainedMarks / totalMarks) * 100).toFixed(2)) : 0
  const overallGrade = getGradeAndGpa(overallPercentage).grade

  const transcriptRecords = student.results.map((result) => ({
    academicYear: result.examEvent.academicYear.name,
    examType: result.examEvent.type,
    term: result.examEvent.courseExams[0]?.courseOffering.term.name ?? "-",
    totalMarks: Number(result.totalMarks),
    obtainedMarks: Number(result.obtainedMarks),
    percentage: Number(result.percentage),
    grade: result.grade,
    gpa: Number(result.gpa),
    subjects: result.examEvent.courseExams.map((courseExam) => {
      const obtained = Number(courseExam.studentMarks[0]?.obtainedMarks ?? 0)
      const percentage =
        courseExam.totalMarks > 0
          ? Number(((obtained / courseExam.totalMarks) * 100).toFixed(2))
          : 0
      return {
        subject: courseExam.courseOffering.course.name,
        totalMarks: courseExam.totalMarks,
        obtainedMarks: obtained,
        percentage,
        grade: getGradeAndGpa(percentage).grade,
        status: percentage >= 50 ? "Pass" : "Fail",
      }
    }),
  }))

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex justify-end gap-2">
        <DownloadResultCard
          fileName={`transcript-${student.rollNo}.pdf`}
          student={{
            institute: student.institute.name,
            name: student.name,
            rollNo: student.rollNo,
            program: student.program.name,
            session: student.session.name,
            section: student.studentEnrollments[0]?.section?.name ?? "-",
          }}
          records={transcriptRecords}
          overall={{
            totalMarks: Number(totalMarks),
            obtainedMarks: Number(obtainedMarks),
            percentage: overallPercentage,
            grade: overallGrade,
          }}
        />
        <Button asChild variant="outline">
          <Link href="/admin/results">Back</Link>
        </Button>
      </div>

      {student.results.map((result) => (
        <Card key={`detail-${result.id}`}>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground">
                {result.examEvent.academicYear.name} | {result.examEvent.type}
              </p>
            </div>

            <div className="overflow-x-auto">
              <h1 className="text-2xl font-bold text-center tracking-tight">{student.institute.name}</h1>
              <div className="mt-3 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-semibold">Name:</span> {student.name}
                </p>

                <p>
                  <span className="font-semibold">Roll No:</span> {student.rollNo}
                </p>
                <p>
                  <span className="font-semibold">Program:</span> {student.program.name}
                </p>
                <p>
                  <span className="font-semibold">Session:</span> {student.session.name}
                </p>
                <p>
                  <span className="font-semibold">Term:</span>{" "}
                  {result.examEvent.courseExams[0]?.courseOffering.term.name ?? "-"}
                </p>
                <p>
                  <span className="font-semibold">Section:</span>{" "}
                  {student.studentEnrollments[0]?.section?.name ?? "-"}
                </p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Obtained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.examEvent.courseExams.map((courseExam) => {
                    const obtained = courseExam.studentMarks[0]?.obtainedMarks ?? 0
                    return (
                      <TableRow key={`${result.id}-${courseExam.id}`}>
                        <TableCell>{courseExam.courseOffering.course.name}</TableCell>
                        <TableCell>{courseExam.totalMarks}</TableCell>
                        <TableCell>{obtained}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between mt-6">
              <div>Obtained Marks: {obtainedMarks}</div>
              <div>Percentage: {overallPercentage}%</div>
              <div>Grade: {getGradeAndGpa(overallPercentage).grade}</div>
            </div>
          </CardContent>
        </Card>
      ))}


    </div>
  )
}

export default ResultCard
