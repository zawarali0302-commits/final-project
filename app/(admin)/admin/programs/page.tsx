import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { getProgramsByInstitute } from "@/prisma/program.service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProgramsPage() {
  // 1️⃣ Get Clerk user
  const clerkUser = await currentUser()
  if (!clerkUser) return <div>Not authenticated</div>

  // 2️⃣ Get user in DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  })
  if (!dbUser?.instituteId) return <div>No institute found</div>

  // 3️⃣ Get all programs in that institute
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