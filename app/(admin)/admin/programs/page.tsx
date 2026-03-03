import { getProgramsByInstitute } from "@/prisma/program.service"
import { getUserByClerkId } from "@/prisma/user.service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

export default async function ProgramsPage() {
  const dbUser = await getUserByClerkId()

  if (!dbUser?.instituteId) {
    return <div>No institute found</div>
  }

  const programs = await getProgramsByInstitute(dbUser.instituteId)
  const isEmpty = programs.length === 0

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Programs</h1>
      <Card>
        <CardContent>
          {isEmpty ? (
            <p>No programs found in your institute</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>System</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell>{program.name}</TableCell>
                    <TableCell>{program.department.name}</TableCell>
                    <TableCell>{program.level}</TableCell>
                    <TableCell>{program.system}</TableCell>
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
