"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AssignCourseToTermForm from "@/components/forms/term-course-assign-form"

interface Course {
  id: string
  name: string
  code?: string
  department?: {
    name: string
  }
}

interface AssignTermCourseDialogProps {
  termId: string
  courses: Course[]
}

export default function AssignTermCourseDialog({
  termId,
  courses,
}: AssignTermCourseDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Course</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Course To Term</DialogTitle>
          <DialogDescription>
            Search and select a course to assign it to this term.
          </DialogDescription>
        </DialogHeader>

        <AssignCourseToTermForm
          termId={termId}
          courses={courses}
          onAssigned={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
