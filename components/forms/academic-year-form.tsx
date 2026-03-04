"use client"

import { useServerAction } from "@/hook/useServerAction"
import { createAcademicYear, updateAcademicYear } from "@/app/actions/academicYear.actions"
import { Button } from "@/components/ui/button"

interface AcademicYearFormProps {
  instituteId: string | undefined
  onSuccess?: () => void
  initialData?: {
    id: string
    name: string
    startDate: Date
    endDate: Date
  }
}

export default function AcademicYearForm({
  instituteId,
  onSuccess,
  initialData,
}: AcademicYearFormProps) {

  const action = initialData
    ? updateAcademicYear.bind(null, initialData.id)
    : createAcademicYear

  const { execute, isPending } = useServerAction(action, {
    onSuccess,
  })

  return (
    <form action={execute} className="space-y-6 max-w-xl">

      <input type="hidden" name="instituteId" value={instituteId} />

      {/* Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Academic Year Name
        </label>

        <input
          type="text"
          name="name"
          required
          defaultValue={initialData?.name}
          placeholder="2024-2025"
          className="h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm shadow-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </div>

      {/* Start Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Start Date
        </label>

        <input
          type="date"
          name="startDate"
          required
          defaultValue={
            initialData?.startDate
              ? new Date(initialData.startDate).toISOString().split("T")[0]
              : ""
          }
          className="h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm shadow-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </div>

      {/* End Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          End Date
        </label>

        <input
          type="date"
          name="endDate"
          required
          defaultValue={
            initialData?.endDate
              ? new Date(initialData.endDate).toISOString().split("T")[0]
              : ""
          }
          className="h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm shadow-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending
          ? "Saving..."
          : initialData
          ? "Update Academic Year"
          : "Create Academic Year"}
      </Button>
    </form>
  )
}
