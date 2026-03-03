"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
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

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Student Results</h1>
        <span className="ml-auto w-1/3">
          <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by student name or roll no"
        />
        </span>

      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subjects</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">
                <div>{row.studentName}</div>
                <div className="text-xs text-muted-foreground">
                  Roll No: {row.rollNo}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {row.obtainedMarks} / {row.totalMarks}
                </div>
                <div className="text-xs text-muted-foreground">
                  {row.percentage}% | Grade {row.grade} | GPA {row.gpa}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={row.isPublished ? "default" : "secondary"}>
                  {row.isPublished ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="min-w-[320px]">
                <details>
                  <summary className="cursor-pointer text-sm text-blue-600">
                    View {row.subjectRows.length} subject
                    {row.subjectRows.length === 1 ? "" : "s"}
                  </summary>
                  <div className="mt-2 rounded-md border p-2">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
