import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Building2 } from "lucide-react"
import { getDepartments } from "@/prisma/department.service"
import { EmptyState } from "@/components/empty-state"
import Dropdown from "@/components/dropdown"
import { deleteDepartment } from "@/app/actions/department.actions"

const DepartmentsPage = async () => {
    const departments = await getDepartments();
    const isEmpty = departments.length === 0
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Departments</h2>
                    <p className="text-muted-foreground">
                        Manage academic departments in your institution
                    </p>
                </div>

                <Link href="/admin/departments/create">
                    <Button>Add Department</Button>
                </Link>
            </div>
            {/* Empty State */}
            {isEmpty ? (
                <EmptyState
                    icon={<Building2 />}
                    title="No departments yet"
                    description="Departments help organize teachers, classes, and subjects."
                    button="Add department"
                    href="/admin/departments/create"
                />
            ) : (
                <Card>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="w-12 text-right">Actions</TableHead>

                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {departments.map((dept) => (
                                    <TableRow
                                        key={dept.id}
                                        className="cursor-pointer hover:bg-muted transition-colors"
                                    >
                                        <TableCell className="font-medium">
                                            <Link href={`/admin/departments/${dept.id}`}>{dept.name}</Link>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(dept.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {/* <DepartmentDropdown id={dept.id} /> */}
                                            <Dropdown id={dept.id} viewRoute={`/admin/departments/${dept.id}`} editRoute={`/admin/departments/${dept.id}/edit`} deleteAction={deleteDepartment.bind(null, dept.id)} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default DepartmentsPage
