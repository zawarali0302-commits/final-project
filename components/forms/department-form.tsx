"use client"

import { createDepartment, updateDepartment } from "@/app/actions/department.actions"
import { useServerAction } from "@/hook/useServerAction"
import { Button } from "@/components/ui/button"

interface DepartmentFormProps {
  instituteId: string
  redirectTo?: string
  onSuccess?: () => void
  initialData?: {
    id: string
    name: string
  }
}

export function DepartmentForm({
  instituteId,
  initialData,
  redirectTo = "/admin/departments",
  onSuccess,
}: DepartmentFormProps) {

  const action = initialData
    ? updateDepartment.bind(null, initialData.id)
    : createDepartment

  const { execute, isPending } = useServerAction(action, {
    redirectTo,
    onSuccess,
  })

  return (
    <form action={execute} className="space-y-6">
      <div>
        <label className="text-sm font-medium">
          Department Name
        </label>
        {/* hidden */}
        <input
          name="instituteId"
          type="hidden"
          defaultValue={instituteId}
          required
        />
        <input
          name="name"
          defaultValue={initialData?.name}
          required
          placeholder="e.g. Computer Science"
          className="mt-2 h-10 w-full rounded-lg border border-input/80 bg-background/80 px-3 py-2 text-sm shadow-sm transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
              ? "Update Department"
              : "Create Department"}
        </Button>
      </div>
    </form>
  )
}
