"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTeacher, updateTeacher } from "@/app/actions/teacher.actions"
import { useServerAction } from "@/hook/useServerAction"

interface TeacherFormProps {
  departments: {
    id: string
    name: string
  }[]
  instituteId: string
  redirectTo?: string
  onSuccess?: () => void
  defaultDepartmentId?: string
  initialData?: {
    id: string
    name: string
    email: string
    designation: string
    departmentId: string
  }
}

export default function TeacherForm({
  departments,
  instituteId,
  redirectTo,
  onSuccess,
  defaultDepartmentId,
  initialData,
}: TeacherFormProps) {

  const action = initialData
    ? updateTeacher.bind(null, initialData.id)
    : createTeacher

  const { execute, isPending } = useServerAction(action, {
    redirectTo,
    onSuccess,
  })

  return (
    <form action={execute} className="space-y-4">
      <input type="hidden" name="instituteId" value={instituteId} />

      <div className="space-y-2">
        <Label>Name</Label>
        <Input name="name" required defaultValue={initialData?.name} />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          required
          defaultValue={initialData?.email}
        />
      </div>

      <div className="space-y-2">
        <Label>Designation</Label>
        <Input
          name="designation"
          required
          defaultValue={initialData?.designation}
        />
      </div>

      <div className="space-y-2">
        <Label>Department</Label>
        <select
          name="departmentId"
          className="w-full border rounded-md p-2"
          required
          defaultValue={initialData?.departmentId ?? defaultDepartmentId ?? ""}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full">
        {isPending
          ? initialData
            ? "Updating..."
            : "Creating..."
          : initialData
            ? "Update Teacher"
            : "Create Teacher"}
      </Button>
    </form>
  )
}
