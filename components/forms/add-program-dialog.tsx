"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProgramForm } from "@/components/forms/program-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddProgramDialogProps {
  departmentId: string
  triggerLabel?: string
}

export function AddProgramDialog({
  departmentId,
  triggerLabel = "Add Program",
}: AddProgramDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Program</DialogTitle>
          <DialogDescription>Add a new program under this department.</DialogDescription>
        </DialogHeader>

        <ProgramForm
          departmentId={departmentId}
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
