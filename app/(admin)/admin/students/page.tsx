import { deleteStudent } from '@/app/actions/student.actions'
import Dropdown from '@/components/dropdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import { getStudents, getStudentsByInstitute } from '@/prisma/student.service'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

const StudentPage = async () => {
    const clerkUser = await currentUser()

    if (!clerkUser) {
        return <div>Not authenticated</div>
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
    })

    if (!dbUser?.instituteId) {
        return <div>No institute found</div>
    }
    const students = await getStudentsByInstitute(
        dbUser.instituteId
    )
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Students</h2>
                    <p className="text-muted-foreground">
                        Manage students in your institution
                    </p>
                </div>

                <Button asChild>
                    <Link href="/admin/students/create">
                        Add Student
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent>
                    {students.length === 0 ? (
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
                                {students.map((student) => (
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
