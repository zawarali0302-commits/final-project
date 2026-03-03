import { getStudentById } from "@/prisma/student.service"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StudentDetailPageProps {
    params: Promise<{
        id: string
    }>
}

const StudentDetailPage = async ({ params }: StudentDetailPageProps) => {
    const { id } = await params
    const student = await getStudentById(id)

    if (!student) return notFound()

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between">
                <div>
                    <p><strong>Name:</strong> {student.name}</p>
                    <p><strong>Roll No:</strong> {student.rollNo}</p>
                    <p><strong>Gender:</strong> {student.gender}</p>
                    <p><strong>Department:</strong> {student.program.department.name}</p>
                    <p><strong>Program:</strong> {student.program.name}</p>
                </div>

                <Button asChild variant="outline">
                    <Link href="/admin/students">Back</Link>
                </Button>
            </div>

            {/* Enrollments */}
            {student.studentEnrollments.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <p>This student is not enrolled in any section yet.</p>
                    </CardContent>
                </Card>
            ) : (
                student.studentEnrollments.map((enrollment) => (
                    <div key={enrollment.id}>
                        <p><strong>Term:</strong> {enrollment.section?.term.name}</p>
                        <p><strong>Section:</strong> {enrollment.section?.name}</p>
                        <Card className="mt-6">
                            <CardContent>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Enrolled Courses
                                    </h3>

                                    {enrollment.section?.sectionCourses.length === 0 ? (
                                        <p>No courses assigned to this section.</p>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Code</TableHead>
                                                    <TableHead>Credits</TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {enrollment.section?.sectionCourses
                                                    .slice()
                                                    .sort((a, b) =>
                                                        (a.courseOffering.course.name || "").localeCompare(
                                                            b.courseOffering.course.name || ""
                                                        )
                                                    )
                                                    .map((sc) => (
                                                        <TableRow key={sc.id}>
                                                            <TableCell>
                                                                {sc.courseOffering.course.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {sc.courseOffering.course.code}
                                                            </TableCell>
                                                            <TableCell>
                                                                {sc.courseOffering.course.credits}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        {/* Courses */}



                    </div>
                ))
            )}
        </div>
    )
}

export default StudentDetailPage