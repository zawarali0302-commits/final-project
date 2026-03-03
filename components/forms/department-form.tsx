"use client"

import { createDepartment, updateDepartment } from "@/app/actions/department.actions"
import { useServerAction } from "@/hook/useServerAction"

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
          className="w-full border p-2 rounded-md"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          {isPending
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
              ? "Update Department"
              : "Create Department"}
        </button>
      </div>
    </form>
  )
}
