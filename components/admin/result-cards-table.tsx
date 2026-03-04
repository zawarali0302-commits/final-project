"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SubjectRow {
  subjectName: string
  obtained: number | string
  total: number
}

interface StudentResultRow {
  id: string
  studentId: string
  studentName: string
  rollNo: string
  obtainedMarks: number
  totalMarks: number
  percentage: number
  grade: string
  gpa: number
  isPublished: boolean
  subjectRows: SubjectRow[]
}

interface ResultCardsTableProps {
  rows: StudentResultRow[]
}

export default function ResultCardsTable({ rows }: ResultCardsTableProps) {
  const [query, setQuery] = useState("")

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows

    return rows.filter((row) => {
      return (
        row.studentName.toLowerCase().includes(q) ||
        row.rollNo.toLowerCase().includes(q)
      )
    })
  }, [rows, query])

  const publishedCount = useMemo(
    () => rows.filter((row) => row.isPublished).length,
    [rows]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Student Results</h2>
          <p className="text-sm text-muted-foreground">
            {filteredRows.length} of {rows.length} students shown
          </p>
        </div>
        <div className="w-full sm:w-80">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by student name or roll no"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase text-muted-foreground">Total</p>
            <p className="mt-1 text-2xl font-bold">{rows.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase text-muted-foreground">Published</p>
            <p className="mt-1 text-2xl font-bold">{publishedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs font-medium uppercase text-muted-foreground">Draft</p>
            <p className="mt-1 text-2xl font-bold">{rows.length - publishedCount}</p>
          </CardContent>
        </Card>
      </div>

      {filteredRows.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No students match your search.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRows.map((row) => (
            <Card key={row.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base">{row.studentName}</CardTitle>
                    <p className="text-xs text-muted-foreground">Roll No: {row.rollNo}</p>
                  </div>
                  <Badge variant={row.isPublished ? "default" : "secondary"}>
                    {row.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div className="rounded-md border p-2">
                    <p className="text-xs text-muted-foreground">Marks</p>
                    <p className="font-medium">
                      {row.obtainedMarks} / {row.totalMarks}
                    </p>
                  </div>
                  <div className="rounded-md border p-2">
                    <p className="text-xs text-muted-foreground">Percentage</p>
                    <p className="font-medium">{row.percentage}%</p>
                  </div>
                  <div className="rounded-md border p-2">
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p className="font-medium">{row.grade}</p>
                  </div>
                  <div className="rounded-md border p-2">
                    <p className="text-xs text-muted-foreground">GPA</p>
                    <p className="font-medium">{row.gpa}</p>
                  </div>
                </div>

                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-primary">
                    View {row.subjectRows.length} subject
                    {row.subjectRows.length === 1 ? "" : "s"}
                  </summary>
                  <div className="mt-3 overflow-hidden rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject Name</TableHead>
                          <TableHead>Obtained</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {row.subjectRows.map((subject) => (
                          <TableRow key={`${row.studentId}-${subject.subjectName}`}>
                            <TableCell>{subject.subjectName}</TableCell>
                            <TableCell>{subject.obtained}</TableCell>
                            <TableCell>{subject.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
