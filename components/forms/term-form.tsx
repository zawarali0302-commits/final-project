"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createTerm, updateTerm } from "@/app/actions/term.actions"
import { useServerAction } from "@/hook/useServerAction"
import { Button } from "../ui/button"
import AcademicYearForm from "@/components/forms/academic-year-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TermFormProps {
  programId: string
  instituteId: string
  redirectTo?: string
  onSuccess?: () => void
  showHeading?: boolean
  academicYears: {
    id: string
    name: string
  }[]
  initialData?: {
    id: string
    name: string
    programId: string
    academicYearId: string
  }
}

export default function TermForm({
  programId,
  instituteId,
  academicYears,
  initialData,
  redirectTo = `/admin/programs/${programId}`,
  onSuccess,
  showHeading = true,
}: TermFormProps) {
  const router = useRouter()
  const [isAcademicYearDialogOpen, setIsAcademicYearDialogOpen] = useState(false)

  const action = initialData
    ? updateTerm.bind(null, initialData.id)
    : createTerm

  const { execute, isPending } = useServerAction(action, {
    redirectTo,
    onSuccess,
  })

  return (
    <div className="max-w-xl space-y-6">
      {showHeading ? (
        <h1 className="text-2xl font-bold">
          {initialData ? "Edit Term" : "Add Term"}
        </h1>
      ) : null}

      <form action={execute} className="space-y-4">
        <input type="hidden" name="programId" value={programId} />

        <div className="space-y-2">
          <label className="text-sm font-medium flex justify-between items-center">
            <span>Academic Year</span>
            <Dialog
              open={isAcademicYearDialogOpen}
              onOpenChange={setIsAcademicYearDialogOpen}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  + Add Academic Year
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Create Academic Year</DialogTitle>
                  <DialogDescription>
                    Add a new academic year without leaving this page.
                  </DialogDescription>
                </DialogHeader>
                <AcademicYearForm
                  instituteId={instituteId}
                  onSuccess={() => {
                    setIsAcademicYearDialogOpen(false)
                    router.refresh()
                  }}
                />
              </DialogContent>
            </Dialog>
          </label>

          <select
            name="academicYearId"
            required
            defaultValue={initialData?.academicYearId ?? ""}
            className="h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm shadow-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
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
          <label className="text-sm font-medium">
            Term Name
          </label>

          <input
            type="text"
            name="name"
            required
            defaultValue={initialData?.name}
            placeholder="Semester 1 / Part 1"
            className="h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm shadow-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </div>

        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
              ? "Update Term"
              : "Create Term"}
        </Button>
      </form>
    </div>
  )
}
