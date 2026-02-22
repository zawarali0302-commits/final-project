import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "./ui/card"
import Dropdown from "./dropdown"
import { deleteTeacher } from "@/app/actions/teacher.actions"

interface TeachersTableProps {
  teachers: any[]
}

const TeachersTable = ({ teachers }: TeachersTableProps) => {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.department.name}</TableCell>
                <TableCell>{teacher.designation}</TableCell>
                <TableCell>{teacher._count.sectionCourses}</TableCell>
                <TableCell className="text-right">
                  <Dropdown
                  id = {teacher.id}
                  viewRoute={{
                    pathname: `/admin/teachers/${teacher.id}`,
                    query: { departmentId: teacher.departmentId },
                  }}
                  editRoute={{
                    pathname: `/admin/teachers/${teacher.id}/edit`,
                    query: { departmentId: teacher.departmentId },
                  }}
                  deleteAction={deleteTeacher.bind(null, teacher.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default TeachersTable
