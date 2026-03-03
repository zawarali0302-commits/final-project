"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SectionForm } from "@/components/forms/section-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddSectionDialogProps {
  termId: string
  triggerLabel?: string
}

export function AddSectionDialog({
  termId,
  triggerLabel = "Add Section",
}: AddSectionDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Section</DialogTitle>
          <DialogDescription>Add a new section under this term.</DialogDescription>
        </DialogHeader>

        <SectionForm
          termId={termId}
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
