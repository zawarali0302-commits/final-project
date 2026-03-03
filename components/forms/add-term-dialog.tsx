"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import TermForm from "@/components/forms/term-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddTermDialogProps {
  programId: string
  instituteId: string
  triggerLabel?: string
  academicYears: {
    id: string
    name: string
  }[]
}

export function AddTermDialog({
  programId,
  instituteId,
  academicYears,
  triggerLabel = "Create Term",
}: AddTermDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Term</DialogTitle>
          <DialogDescription>Add a new term for this program.</DialogDescription>
        </DialogHeader>

        <TermForm
          programId={programId}
          instituteId={instituteId}
          academicYears={academicYears}
          redirectTo=""
          showHeading={false}
          onSuccess={() => {
            setOpen(false)
            router.refresh()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
