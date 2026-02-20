import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { getPrograms } from "@/prisma/program.service"
import { ProgramDropdown } from "@/components/dropdowns/program-dropdown"

export default async function ProgramsPage() {
  const programs = await getPrograms()
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-muted-foreground">
            List of all programs in your Institute.
          </p>
        </div>

      <Card>
        <CardContent className="pt-6">
          {programs.length === 0 ? (
            <p>No programs found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>System</TableHead>
                  <TableHead className="w-12 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {programs.map((program) => (
                  <TableRow
                    key={program.id}
                    className="hover:bg-muted transition-colors"
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={{
                          pathname: `/admin/programs/${program.id}`,
                          query: { departmentId: program.departmentId },
                        }}
                        className="hover:underline"
                      >
                        {program.name} 
                      </Link>
                    </TableCell>

                    <TableCell>
                      {program.department.name}
                    </TableCell>

                    <TableCell>{program.level}</TableCell>

                    <TableCell>{program.system}</TableCell>

                    <TableCell className="text-right">
                      <ProgramDropdown id={program.id} />
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
