"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { importStudentsBulk } from "@/app/actions/student.actions"
import { useServerAction } from "@/hook/useServerAction"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BulkStudentImportFormProps {
  instituteId: string
  programs: Array<{ id: string; name: string }>
  sessions: Array<{ id: string; name: string; programId: string }>
  terms: Array<{ id: string; name: string; programId: string }>
  sections: Array<{ id: string; name: string; termId: string }>
  onSuccess?: () => void
}

const TEMPLATE_CONTENT = "rollNo,name,gender\n2026-001,Ali Khan,MALE\n2026-002,Sara Noor,FEMALE\n"

export default function BulkStudentImportForm({
  instituteId,
  programs,
  sessions,
  terms,
  sections,
  onSuccess,
}: BulkStudentImportFormProps) {
  const router = useRouter()
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedSession, setSelectedSession] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("")
  const [selectedSection, setSelectedSection] = useState("")

  const filteredSessions = useMemo(
    () => sessions.filter((session) => session.programId === selectedProgram),
    [sessions, selectedProgram]
  )

  const filteredTerms = useMemo(
    () => terms.filter((term) => term.programId === selectedProgram),
    [terms, selectedProgram]
  )

  const filteredSections = useMemo(
    () => sections.filter((section) => section.termId === selectedTerm),
    [sections, selectedTerm]
  )

  const { execute, isPending } = useServerAction(importStudentsBulk, {
    onSuccess: () => {
      onSuccess?.()
      router.refresh()
    },
  })

  const canSubmit = Boolean(
    selectedProgram && selectedSession && selectedTerm && selectedSection
  )

  const handleDownloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CONTENT], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "student-import-template.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <form action={execute} className="space-y-4">
      <input type="hidden" name="instituteId" value={instituteId} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Upload a CSV or Excel file with columns: <span className="font-medium">rollNo, name, gender</span>.
        </p>
        <Button type="button" variant="outline" onClick={handleDownloadTemplate}>
          Download Template
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Program</label>
        <Select
          name="programId"
          value={selectedProgram}
          onValueChange={(value) => {
            setSelectedProgram(value)
            setSelectedSession("")
            setSelectedTerm("")
            setSelectedSection("")
          }}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent>
            {programs.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Session</label>
        <Select
          name="sessionId"
          value={selectedSession}
          onValueChange={(value) => setSelectedSession(value)}
          disabled={!selectedProgram}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select session" />
          </SelectTrigger>
          <SelectContent>
            {filteredSessions.map((session) => (
              <SelectItem key={session.id} value={session.id}>
                {session.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Term</label>
        <Select
          value={selectedTerm}
          onValueChange={(value) => {
            setSelectedTerm(value)
            setSelectedSection("")
          }}
          disabled={!selectedProgram}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent>
            {filteredTerms.map((term) => (
              <SelectItem key={term.id} value={term.id}>
                {term.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Section</label>
        <Select
          name="sectionId"
          value={selectedSection}
          onValueChange={(value) => setSelectedSection(value)}
          disabled={!selectedTerm}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            {filteredSections.map((section) => (
              <SelectItem key={section.id} value={section.id}>
                {section.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">CSV / Excel File</label>
        <Input name="file" type="file" accept=".csv,.xlsx,.xls" required />
      </div>

      <Button type="submit" className="w-full" disabled={isPending || !canSubmit}>
        {isPending ? "Importing..." : "Import Students"}
      </Button>
    </form>
  )
}
