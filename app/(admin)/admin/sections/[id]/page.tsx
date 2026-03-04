import { StatCard } from "@/components/admin/stat-card"
import AssignSectionCourseDialog from "@/components/forms/assign-section-course-dialog"
import AssignTeachersToSectionCoursesForm from "@/components/forms/assign-teacher-course-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import UnassignSectionCourseForm from "@/components/forms/unassign-section-course-form"
import { getTermCourses } from "@/prisma/courseOffering.service"
import { getSectionById } from "@/prisma/section.service"
import { GraduationCap, LibraryBig, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getTeachersByInstituteId } from "@/prisma/teacher.service"
import { getUserByClerkId } from "@/prisma/user.service"

interface SectionDetailPageProps {
    params: Promise<{ id: string }>
}

export default async function SectionDetailPage({ params }: SectionDetailPageProps) {
    const { id } = await params
    const section = await getSectionById(id)

    if (!section) return notFound()

    const user = await getUserByClerkId()

    if (!user?.instituteId) {
        throw new Error("User is not associated with any institute")
    }
    const teachers = await getTeachersByInstituteId(
        user?.instituteId
    )

    const uniqueStudentCount = new Set(
        section.studentEnrollments.map((enrollment) => enrollment.studentId)
    ).size
    const termCourses = await getTermCourses(section.termId)

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Section {section.name}</h1>
                    <p className="text-muted-foreground">
                        {section.term.program.name} • {section.term.name} •{" "}
                        {section.term.academicYear.name}
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
                        <StatCard
                            title="Students"
                            value={uniqueStudentCount}
                            icon={<Users className="h-5 w-5 text-muted-foreground" />}
                            viewAllHref={`/admin/students?sectionId=${id}`}
                        />
                        <StatCard title="Courses" value={section.sectionCourses.length} icon={<LibraryBig className="h-5 w-5 text-muted-foreground" />} />
                        <StatCard title="Teachers" value={Array.from(new Set(section.sectionCourses.map(sc => sc.teacherId).filter(Boolean))).length} icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />} />
                    </div>

            {/* Courses */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Courses</CardTitle>
                    <AssignSectionCourseDialog sectionId={id} termCourses={termCourses} />
                </CardHeader>

                <CardContent>
                    {section.sectionCourses.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No courses assigned.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {section.sectionCourses
                                    .slice()
                                    .sort((a, b) =>
                                        (a.courseOffering.course.name || "").localeCompare(
                                            b.courseOffering.course.name || ""
                                        )
                                    )
                                    .map((sc) => (
                                        <TableRow key={sc.id}>
                                            <TableCell>{sc.courseOffering.course.name}</TableCell>
                                            <TableCell>{sc.courseOffering.course.code}</TableCell>
                                            <TableCell>
                                                {sc.courseOffering.course.credits ?? "-"}
                                            </TableCell>
                                            <TableCell>
                                                <UnassignSectionCourseForm
                                                    sectionId={id}
                                                    sectionCourseId={sc.id}
                                                />
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
