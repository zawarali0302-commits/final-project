import { deleteStudent } from '@/app/actions/student.actions'
import { AddStudentDialog } from '@/components/forms/add-student-dialog'
import { ImportStudentsDialog } from '@/components/forms/import-students-dialog'
import Dropdown from '@/components/dropdown'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getDepartmentsByInstitute } from '@/prisma/department.service'
import { getProgramsByInstitute } from '@/prisma/program.service'
import { getSectionsByInstitute } from '@/prisma/section.service'
import { getSessionsByInstitute } from '@/prisma/session.service'
import { getStudentsByInstitute } from '@/prisma/student.service'
import { getTermsByInstitute } from '@/prisma/term.service'
import { getUserByClerkId } from '@/prisma/user.service'
import Link from 'next/link'

interface StudentPageProps {
    searchParams?: Promise<{
        sectionId?: string
    }>
}

const StudentPage = async ({ searchParams }: StudentPageProps) => {
    const dbUser = await getUserByClerkId()
    
      if (!dbUser?.instituteId) {
        return <div>No institute found</div>
      }
    const query = searchParams ? await searchParams : undefined
    const selectedSectionId = query?.sectionId?.trim() || ""

    const students = await getStudentsByInstitute(
        dbUser.instituteId
    )
    const departments = await getDepartmentsByInstitute(dbUser.instituteId)
    const programs = await getProgramsByInstitute(dbUser.instituteId)
    const terms = await getTermsByInstitute(dbUser.instituteId)
    const sections = await getSectionsByInstitute(dbUser.instituteId)
    const sessions = await getSessionsByInstitute(dbUser.instituteId)
    const filteredStudents = selectedSectionId
        ? students.filter((student) =>
            student.studentEnrollments.some((enrollment) => enrollment.sectionId === selectedSectionId)
        )
        : students

    const selectedSection = selectedSectionId
        ? sections.find((section) => section.id === selectedSectionId)
        : null
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Students</h2>
                    <p className="text-muted-foreground">
                        {selectedSection
                            ? `Students enrolled in Section ${selectedSection.name}`
                            : "Manage students in your institution"}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <ImportStudentsDialog
                        instituteId={dbUser.instituteId}
                        programs={programs}
                        terms={terms}
                        sections={sections}
                        sessions={sessions}
                    />
                    <AddStudentDialog
                        instituteId={dbUser.instituteId}
                        departments={departments}
                        programs={programs}
                        terms={terms}
                        sections={sections}
                        sessions={sessions}
                    />
                </div>
            </div>

            <Card>
                <CardContent>
                    {filteredStudents.length === 0 ? (
                        <p>No student found</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Roll No</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Program</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow
                                        key={student.id}
                                        className="hover:bg-muted transition-colors"
                                    >
                                        <TableCell>
                                            {student.rollNo}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Link
                                                href={{
                                                    pathname: `/admin/students/${student.id}`,
                                                }}
                                                className="hover:underline"
                                            >
                                                {student.name}
                                            </Link>
                                        </TableCell>

                                        <TableCell>
                                            {student.program.name}
                                        </TableCell>
                                        <TableCell>
                                            <Dropdown
                                                id={student.id}
                                                viewRoute={{
                                                    pathname: `/admin/students/${student.id}`,
                                                }}
                                                editRoute={{
                                                    pathname: `/admin/students/${student.id}/edit`,
                                                }}
                                                deleteAction={deleteStudent}
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

export default StudentPage
