import { unassignCourseFromSection } from "@/app/actions/sectionCourse.actions"
import { StatCard } from "@/components/admin/stat-card"
import AssignTeachersToSectionCoursesForm from "@/components/forms/assign-teacher-course-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UnassignCourseButton from "@/components/unassign-course-button"
import { getSectionById } from "@/prisma/section.service"
import { getTeachers } from "@/prisma/teacher.service"
import { GraduationCap, LibraryBig, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface SectionDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function SectionDetailPage({ params }: SectionDetailPageProps) {
    const { id } = await params
    const section = await getSectionById(id)

    if (!section) return notFound()
    const teachers = await getTeachers()

    // --- Get students from studentEnrollments ---
    const students = section.studentEnrollments.map((se) => se.student)

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Section {section.name}</h1>
                    <p className="text-muted-foreground">
                        {section.term.program.name} • {section.term.name} • {section.term.academicYear.name}
                    </p>
                </div>

                <Button asChild>
                    <Link
                        href={{
                            pathname: `/admin/sections/${id}/edit`,
                            query: { termId: section.termId },
                        }}
                    >
                        Edit Section
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <StatCard title="Students" value={students.length} icon={<Users className="h-5 w-5 text-muted-foreground" />} />
                <StatCard title="Courses" value={section.sectionCourses.length} icon={<LibraryBig className="h-5 w-5 text-muted-foreground" />} />
                <StatCard title="Teachers" value={section.sectionCourses.length} icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />} />
            </div>

            {/* Students */}
            <Card>
                <CardHeader>
                    <CardTitle>Students</CardTitle>
                </CardHeader>

                <CardContent>
                    {students.length === 0 ? (
                        <p className="text-muted-foreground">No students assigned.</p>
                    ) : (
                        <Table className="w-full text-sm">
                            <TableHeader className="border-b">
                                <TableRow>
                                    <TableHead className="text-left py-2">Roll No</TableHead>
                                    <TableHead className="text-left py-2">Name</TableHead>
                                    <TableHead className="text-left py-2">Session</TableHead>
                                    <TableHead className="text-left py-2">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map((student) => (
                                    <TableRow key={student.id} className="border-b">
                                        <TableCell className="py-2">{student.rollNo}</TableCell>
                                        <TableCell className="py-2">{student.name}</TableCell>
                                        <TableCell className="py-2">{student.session.name}</TableCell>
                                        <TableCell className="py-2">{student.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Courses */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Courses</CardTitle>
                    <Button asChild>
                        <Link href={`/admin/sections/${id}/assign`}>
                            Assign Courses
                        </Link>
                    </Button>
                </CardHeader>

                <CardContent>
                    {section.sectionCourses.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No courses assigned.</p>
                    ) : (
                        <Table>
                            <TableHeader className="border-b">
                                <TableRow>
                                    <TableHead className="text-left py-2">Course Name</TableHead>
                                    <TableHead className="text-left py-2">Code</TableHead>
                                    <TableHead className="text-left py-2">Credits</TableHead>
                                    <TableHead className="text-left py-2">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {section.sectionCourses.map((sc) => (
                                    <TableRow key={sc.id} className="border-b">
                                        <TableCell className="py-2">{sc.courseOffering.course.name}</TableCell>
                                        <TableCell className="py-2 text-muted-foreground">{sc.courseOffering.course.code}</TableCell>
                                        <TableCell className="py-2 text-muted-foreground">{sc.courseOffering.course.credits ?? "-"}</TableCell>
                                        <TableCell className="py-2 text-muted-foreground">
                                            <UnassignCourseButton sectionId={id} sectionCourseId={sc.id} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Teachers */}
            <Card>
                <CardHeader>
                    <CardTitle>Assign Teachers</CardTitle>
                </CardHeader>

                <CardContent>
                    <AssignTeachersToSectionCoursesForm
                        sectionId={id}
                        sectionCourses={section.sectionCourses}
                        teachers={teachers}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
