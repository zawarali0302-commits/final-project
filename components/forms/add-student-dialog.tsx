"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import StudentForm from "@/components/forms/student-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddStudentDialogProps {
  instituteId: string
  departments: Array<{ id: string; name: string }>
  programs: Array<{ id: string; name: string }>
  sessions: Array<{ id: string; name: string; programId: string }>
  terms: Array<{ id: string; name: string; programId: string }>
  sections: Array<{ id: string; name: string; termId: string }>
}

export function AddStudentDialog({
  instituteId,
  departments,
  programs,
  sessions,
  terms,
  sections,
}: AddStudentDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Student</DialogTitle>
          <DialogDescription>Add a new student to your institute.</DialogDescription>
        </DialogHeader>

        <StudentForm
          instituteId={instituteId}
          departments={departments}
          programs={programs}
          sessions={sessions}
          terms={terms}
          sections={sections}
          redirectTo=""
          onSuccess={() => {
            setOpen(false)
            router.refresh()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
