"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DepartmentForm } from "@/components/forms/department-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddDepartmentDialogProps {
  instituteId: string
  triggerLabel?: string
}

export function AddDepartmentDialog({
  instituteId,
  triggerLabel = "Add Department",
}: AddDepartmentDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription>
            Add a new department for your institute.
          </DialogDescription>
        </DialogHeader>

        <DepartmentForm
          instituteId={instituteId}
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
