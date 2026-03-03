"use client"

import { useState } from "react"
import BulkStudentImportForm from "@/components/forms/bulk-student-import-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ImportStudentsDialogProps {
  instituteId: string
  programs: Array<{ id: string; name: string }>
  sessions: Array<{ id: string; name: string; programId: string }>
  terms: Array<{ id: string; name: string; programId: string }>
  sections: Array<{ id: string; name: string; termId: string }>
}

export function ImportStudentsDialog({
  instituteId,
  programs,
  sessions,
  terms,
  sections,
}: ImportStudentsDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Students</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Import Students</DialogTitle>
          <DialogDescription>
            Keep your current manual student form. Use this option only when you want to import many students at once.
          </DialogDescription>
        </DialogHeader>

        <BulkStudentImportForm
          instituteId={instituteId}
          programs={programs}
          sessions={sessions}
          terms={terms}
          sections={sections}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
