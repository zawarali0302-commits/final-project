"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createStudent, updateStudent } from "@/app/actions/student.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useServerAction } from "@/hook/useServerAction"
import { StudentStatus } from "@/app/generated/prisma/enums"
import SessionForm from "@/components/forms/session-form"

interface StudentFormProps {
  instituteId: string | undefined
  redirectTo?: string
  onSuccess?: () => void
  departments: Array<{
    id: string
    name: string
  }>
  programs: Array<{
    id: string
    name: string
  }>
  sessions: Array<{
    id: string
    name: string
    programId: string
  }>
  terms: Array<{
    id: string
    name: string
    programId: string
  }>
  sections: Array<{
    id: string
    name: string
    termId: string
  }>
  initialData?: {
    id: string
    name: string
    rollNo: string
    gender: "MALE" | "FEMALE" | "OTHER"
    status: StudentStatus
    instituteId: string
    programId: string
    sessionId: string
    sectionId: string | null
  }
}

export default function StudentForm(props: StudentFormProps) {
  const {
    instituteId,
    programs,
    sessions,
    terms,
    sections,
    initialData,
    redirectTo,
    onSuccess,
  } = props
  const router = useRouter()
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false)

  const [selectedProgram, setSelectedProgram] = useState(
    initialData?.programId ?? ""
  )
  const [selectedSession, setSelectedSession] = useState(
    initialData?.sessionId ?? ""
  )
  const [selectedTerm, setSelectedTerm] = useState(
    initialData
      ? sections.find((s) => s.id === initialData.sectionId)?.termId ?? ""
      : ""
  )
  const [selectedSection, setSelectedSection] = useState(
    initialData?.sectionId ?? ""
  )

  const filteredSessions = sessions.filter(
    (s) => s.programId === selectedProgram
  )
  const filteredTerms = terms.filter((t) => t.programId === selectedProgram)
  const filteredSections = sections.filter((s) => s.termId === selectedTerm)

  const actionToUse = initialData
    ? updateStudent.bind(null, initialData.id)
    : createStudent

  const { execute, isPending } = useServerAction(actionToUse, {
    redirectTo,
    onSuccess,
  })

  return (
    <form action={execute} className="space-y-6">
      <input type="hidden" name="instituteId" value={instituteId} />

      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input name="name" defaultValue={initialData?.name} required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Roll Number</label>
        <Input name="rollNo" defaultValue={initialData?.rollNo} required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Gender</label>
        <Select name="gender" defaultValue={initialData?.gender} required>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">Male</SelectItem>
            <SelectItem value="FEMALE">Female</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {initialData ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            name="status"
            defaultValue={initialData.status ?? "ACTIVE"}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={StudentStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={StudentStatus.GRADUATED}>Graduated</SelectItem>
              <SelectItem value={StudentStatus.SUSPENDED}>Suspended</SelectItem>
              <SelectItem value={StudentStatus.WITHDRAWN}>Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

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
            {programs.map((prog) => (
              <SelectItem key={prog.id} value={prog.id}>
                {prog.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="flex justify-between text-sm font-medium">
          <span>Session</span>
          <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-sm text-blue-600 disabled:text-muted-foreground"
                disabled={!selectedProgram || !instituteId}
              >
                + Add Session
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Create Session</DialogTitle>
                <DialogDescription>
                  Add a new session for the selected program without leaving this page.
                </DialogDescription>
              </DialogHeader>
              {instituteId ? (
                <SessionForm
                  instituteId={instituteId}
                  programs={programs}
                  defaultProgramId={selectedProgram}
                  onSuccess={() => {
                    setIsSessionDialogOpen(false)
                    router.refresh()
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Institute is required to create a session.
                </p>
              )}
            </DialogContent>
          </Dialog>
        </label>

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

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? initialData
            ? "Updating..."
            : "Adding..."
          : initialData
            ? "Update Student"
            : "Add Student"}
      </Button>
    </form>
  )
}
