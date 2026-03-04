import { deleteSection } from "@/app/actions/section.actions"
import Dropdown from "@/components/dropdown"
import AssignTermCourseDialog from "@/components/forms/assign-term-course-dialog"
import { AddSectionDialog } from "@/components/forms/add-section-dialog"
import UnassignTermCourseForm from "@/components/forms/unassign-term-course-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCoursesByInstituteId } from "@/prisma/course.service"
import { getTermById } from "@/prisma/term.service"
import { getUserByClerkId } from "@/prisma/user.service"
import Link from "next/link"

interface TermDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function TermDetailPage({ params }: TermDetailPageProps) {
    const { id } = await params

    const term = await getTermById(id)
    const user = await getUserByClerkId()

    if (!term) {
        return <div className="text-red-500">Term not found</div>
    }

    const courses = user?.instituteId
        ? await getCoursesByInstituteId(user.instituteId)
        : []

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Term Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">{term.name}</h1>
                    <p className="text-gray-600">
                        Program: {term.program.name} | Academic Year: {term.academicYear.name}
                    </p>
                </div>
                <Button asChild>

                    <Link
                        href={{
                            pathname: `/admin/terms/${id}/edit`,
                            query: { programId: term.programId },
                        }}
                    >
                        Edit Term
                    </Link>
                </Button>
            </div>

            {/* Sections */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Sections</CardTitle>

                    <AddSectionDialog termId={term.id} />
                </CardHeader>
                <CardContent>
                    {term.sections.length === 0 ? (
                        <p className="text-gray-500">No sections created yet.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Students</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {term.sections.map((section) => (
                                    <TableRow key={section.id}>
                                        <TableCell className="font-medium">
                                            <Link href={{
                                                pathname: `/admin/sections/${section.id}`,
                                                query: { termId: term.id },
                                            }}
                                            className="text-primary hover:underline"
                                            >
                                                {section.name}
                                            </Link>
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            {new Set(
                                                section.studentEnrollments.map((enrollment) => enrollment.studentId)
                                            ).size}
                                        </TableCell>
                                        <TableCell>
                                            <Dropdown
                                                id={section.id}
                                                viewRoute={{
                                                    pathname: `/admin/sections/${section.id}`,
                                                    query: { termId: term.id },
                                                }}
                                                editRoute={{
                                                    pathname: `/admin/sections/${section.id}/edit`,
                                                    query: { termId: term.id },
                                                }}
                                                deleteAction={deleteSection.bind(null, section.id)}
                                            />
                                        </TableCell>
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
                    <CardTitle>Courses Offered</CardTitle>
                    <AssignTermCourseDialog termId={term.id} courses={courses} />
                </CardHeader>

                <CardContent>
                    {term.courseOfferings.length === 0 ? (
                        <p className="text-muted-foreground">
                            No courses offered yet.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {term.courseOfferings.map((offering) => (
                                    <TableRow key={offering.id}>
                                        <TableCell>
                                            {offering.course.name}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {offering.course.code}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {offering.course.credits ?? "-"}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <UnassignTermCourseForm 
                                            termId = {term.id}
                                            courseOfferingId = {offering.id}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
