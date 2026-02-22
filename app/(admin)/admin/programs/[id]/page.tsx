import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { getProgramById } from "@/prisma/program.service"
import { ProgramLevel } from "@/app/generated/prisma/enums"
import Dropdown from "@/components/dropdown"
import { deleteTerm } from "@/app/actions/term.actions"

interface ProgramDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProgramDetailPage({
  params,
}: ProgramDetailPageProps) {
  const { id } = await params
  const program = await getProgramById(id)

  if (!program) return <p>Program not found</p>

  const isIntermediate = program.level === ProgramLevel.INTERMEDIATE

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{program.name}</h1>
        <p className="text-muted-foreground">
          {program.level} • {program.system}
        </p>
        <p className="text-sm mt-1">
          Department: <span className="font-medium">{program.department.name}</span>
        </p>
      </div>

      {/* Terms */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Program Terms</CardTitle>

          <Button size="sm" asChild>
            <Link href={{
              pathname: "/admin/terms/create",
              query: { programId: id },
            }}>
              {isIntermediate ? "Create Part" : "Create Semester"}
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {program.terms.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No terms created yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Sections</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {program.terms.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">
                      {term.name}
                    </TableCell>

                    <TableCell className="font-medium">{term.academicYear.name}</TableCell>

                    <TableCell className="font-medium">{term.sections.length}</TableCell>

                    <TableCell>
                      <Dropdown 
                        id = {term.id}
                        viewRoute={{
                          pathname: `/admin/terms/${term.id}`,
                          query: { programId: program.id },
                        }}
                        editRoute={{
                          pathname: `/admin/terms/${term.id}/edit`,
                          query: { programId: program.id },
                        }}
                        deleteAction={deleteTerm.bind(null, term.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Subjects */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subjects</CardTitle>

          <Button size="sm" asChild>
            <Link href={`/admin/programs/${program.id}/subjects/create`}>
              Add Subjects
            </Link>
          </Button>
        </CardHeader>

        <CardContent>
          {program.subjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No subjects added to this program yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {program.subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.code}</TableCell>
                    <TableCell>
                      <SubjectDropdown
                        programId={program.id}
                        subjectId={subject.id}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card> */}
    </div>
  )
}
