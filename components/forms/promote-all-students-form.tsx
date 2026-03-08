"use client"

import { promoteAllStudentsToNextTerm } from "@/app/actions/term.actions"
import { useServerAction } from "@/hook/useServerAction"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PromoteAllStudentsFormProps {
  sourceTermId: string
  academicYears: Array<{ id: string; name: string }>
  terms: Array<{ id: string; name: string; academicYearId: string }>
  sections: Array<{ id: string; name: string; termId: string }>
}

const PromoteAllStudentsForm = ({
  sourceTermId,
  academicYears,
  terms,
  sections,
}: PromoteAllStudentsFormProps) => {
  const [open, setOpen] = useState(false)
  const [targetAcademicYearId, setTargetAcademicYearId] = useState("")
  const [targetTermId, setTargetTermId] = useState("")
  const [targetSectionId, setTargetSectionId] = useState("")
  const { execute, isPending } = useServerAction(promoteAllStudentsToNextTerm, {
    onSuccess: () => setOpen(false),
  })

  const filteredTerms = useMemo(
    () => terms.filter((item) => item.academicYearId === targetAcademicYearId),
    [terms, targetAcademicYearId]
  )

  const filteredSections = useMemo(
    () => sections.filter((item) => item.termId === targetTermId),
    [sections, targetTermId]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Promote All Students</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Promote Students</DialogTitle>
          <DialogDescription>
            Choose target academic year, term, and section for all students.
          </DialogDescription>
        </DialogHeader>

        <form action={execute} className="space-y-4">
          <input type="hidden" name="sourceTermId" value={sourceTermId} />

          <div className="space-y-2">
            <label className="text-sm font-medium">Academic Year</label>
            <select
              name="targetAcademicYearId"
              required
              value={targetAcademicYearId}
              onChange={(event) => {
                setTargetAcademicYearId(event.target.value)
                setTargetTermId("")
                setTargetSectionId("")
              }}
              className="h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              <option value="" disabled>
                Select academic year
              </option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Term</label>
            <select
              name="targetTermId"
              required
              value={targetTermId}
              onChange={(event) => {
                setTargetTermId(event.target.value)
                setTargetSectionId("")
              }}
              disabled={!targetAcademicYearId}
              className="h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="" disabled>
                Select term
              </option>
              {filteredTerms.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Section</label>
            <select
              name="targetSectionId"
              required
              value={targetSectionId}
              onChange={(event) => setTargetSectionId(event.target.value)}
              disabled={!targetTermId}
              className="h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="" disabled>
                Select section
              </option>
              {filteredSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Promoting..." : "Confirm Promotion"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PromoteAllStudentsForm
