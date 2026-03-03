"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CourseForm } from "@/components/forms/course-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AddCourseDialogProps {
  departmentId: string
  triggerLabel?: string
}

export function AddCourseDialog({
  departmentId,
  triggerLabel = "Add Course",
}: AddCourseDialogProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>Add a new course under this department.</DialogDescription>
        </DialogHeader>

        <CourseForm
          departmentId={departmentId}
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
