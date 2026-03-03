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
import AssignCourseToSectionForm from "@/components/forms/section-course-assign-form"

interface TermCourse {
  id: string
  course: {
    name: string
    code: string
  }
}

interface AssignSectionCourseDialogProps {
  sectionId: string
  termCourses: TermCourse[]
}

export default function AssignSectionCourseDialog({
  sectionId,
  termCourses,
}: AssignSectionCourseDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Assign Courses</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Course To Section</DialogTitle>
          <DialogDescription>
            Select one course from this term to assign to the section.
          </DialogDescription>
        </DialogHeader>

        <AssignCourseToSectionForm
          sectionId={sectionId}
          termCourses={termCourses}
          onAssigned={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
