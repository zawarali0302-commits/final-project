"use client"

import { createTerm, updateTerm } from "@/app/actions/term.actions"
import { useServerAction } from "@/hook/useServerAction"
import { Button } from "../ui/button"

interface TermFormProps {
  programId: string
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
  academicYears,
  initialData,
}: TermFormProps) {
  const action = initialData
    ? updateTerm.bind(null, initialData.id)
    : createTerm

  const { execute, isPending } = useServerAction(action,{
    redirectTo: `/admin/programs/${programId}`,
  })

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">
        {initialData ? "Edit Term" : "Add Term"}
      </h1>

      <form action={execute} className="space-y-4">
        <input type="hidden" name="programId" value={programId} />

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Academic Year
          </label>

          <select
            name="academicYearId"
            required
            defaultValue={initialData?.academicYearId ?? ""}
            className="w-full border rounded-md p-2"
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
            className="w-full border rounded-md p-2"
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