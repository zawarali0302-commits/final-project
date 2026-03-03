"use client"

import { useMemo, useState } from "react"
import { createExam } from "@/app/actions/exam.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useServerAction } from "@/hook/useServerAction"

interface SectionCourseOption {
  courseOfferingId: string
  courseName: string
  courseCode: string
}

interface SectionOption {
  id: string
  name: string
  term: {
    name: string
    program: {
      name: string
    }
    academicYear: {
      name: string
    }
  }
  sectionCourses: SectionCourseOption[]
}

interface Props {
  sections: SectionOption[]
}

const CreateExamForm = ({ sections }: Props) => {
  const { execute, isPending } = useServerAction(createExam)
  const [sectionId, setSectionId] = useState("")
  const [courseOfferingId, setCourseOfferingId] = useState("")

  const selectedSection = useMemo(
    () => sections.find((section) => section.id === sectionId),
    [sections, sectionId]
  )

  const sectionCourses = selectedSection?.sectionCourses ?? []
  const canSubmit = Boolean(sectionId && courseOfferingId)

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create Exam</h1>
      <p className="text-sm text-muted-foreground">
        One exam is created per course offering. If the same course is assigned to multiple sections in the same term,
        creating it once will apply to all linked sections.
      </p>

      <form action={execute} className="space-y-4">
        <div>
          <Label htmlFor="sectionId">Section</Label>
          <select
            id="sectionId"
            name="sectionId"
            className="w-full border p-2 rounded"
            required
            value={sectionId}
            onChange={(e) => {
              setSectionId(e.target.value)
              setCourseOfferingId("")
            }}
          >
            <option value="">Select Section</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.term.program.name} - {section.term.academicYear.name} - {section.term.name} - Section {section.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Section is used to pick a valid course offering.
          </p>
        </div>

        <div>
          <Label htmlFor="courseOfferingId">Course In Selected Section</Label>
          <select
            id="courseOfferingId"
            name="courseOfferingId"
            className="w-full border p-2 rounded"
            required
            value={courseOfferingId}
            onChange={(e) => setCourseOfferingId(e.target.value)}
            disabled={!selectedSection || sectionCourses.length === 0}
          >
            <option value="">Select Course</option>
            {sectionCourses.map((offering) => (
              <option key={offering.courseOfferingId} value={offering.courseOfferingId}>
                {offering.courseName} ({offering.courseCode})
              </option>
            ))}
          </select>
          {selectedSection && sectionCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-1">
              This section has no assigned courses yet. Assign courses first.
            </p>
          ) : null}
          {selectedSection && sectionCourses.length > 0 ? (
            <p className="text-xs text-muted-foreground mt-1">
              If this course is shared by other sections in this term, this exam will also be used there.
            </p>
          ) : null}
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <select id="type" name="type" className="w-full border p-2 rounded" required>
            <option value="MID">Mid</option>
            <option value="FINAL">Final</option>
            <option value="QUIZ">Quiz</option>
            <option value="ASSIGNMENT">Assignment</option>
          </select>
        </div>

        <div>
          <Label htmlFor="date">Exam Date</Label>
          <Input id="date" type="date" name="date" />
          <p className="text-xs text-muted-foreground mt-1">
            Optional. Leave empty to create without a scheduled date.
          </p>
        </div>

        <div>
          <Label htmlFor="totalMarks">Total Marks</Label>
          <Input id="totalMarks" type="number" name="totalMarks" min={1} required />
        </div>

        <Button type="submit" className="w-full" disabled={isPending || !canSubmit}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  )
}

export default CreateExamForm
