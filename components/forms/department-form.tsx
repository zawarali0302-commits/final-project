"use client"

import { useForm } from "react-hook-form"
import { createDepartment, updateDepartment } from "@/app/actions/department.actions"
import { useServerAction } from "@/hook/useServerAction"

interface FormValues {
  name: string
}

interface DepartmentFormProps {
  initialData?: {
    id: string
    name: string
  }
}

export function DepartmentForm({ initialData }: DepartmentFormProps) {

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: initialData?.name || "",
    },
  })

  // Bind ID for update
  const action = initialData
    ? updateDepartment.bind(null, initialData.id) : createDepartment

  const { execute, isPending } = useServerAction(action, {
    redirectTo: "/admin/departments",
    onSuccess: () => reset(),
  })

  return (
    <form onSubmit={handleSubmit(execute)} className="space-y-6">
      <div>
        <label className="text-sm font-medium">Department Name</label>
        <input
          {...register("name", { required: true })}
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