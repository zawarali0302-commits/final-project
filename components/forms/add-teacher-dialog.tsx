"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TeacherForm from "@/components/forms/teacher-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddTeacherDialogProps {
  instituteId: string
  departments: {
    id: string
    name: string
  }[]
  triggerLabel?: string
  defaultDepartmentId?: string
}

export function AddTeacherDialog({
  instituteId,
  departments,
  triggerLabel = "Add Teacher",
  defaultDepartmentId,
}: AddTeacherDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Teacher</DialogTitle>
          <DialogDescription>Add a new teacher to the institute.</DialogDescription>
        </DialogHeader>

        <TeacherForm
          instituteId={instituteId}
          departments={departments}
          defaultDepartmentId={defaultDepartmentId}
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
