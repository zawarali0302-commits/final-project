"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  createDepartment,
  updateDepartment,
} from "@/app/actions/department.actions"
import { useForm } from "react-hook-form"

interface DepartmentFormProps {
  initialData?: {
    id: string
    name: string
  }
}

export function DepartmentForm({ initialData }: DepartmentFormProps) {
  const { register } = useForm()
  // bind server action (THIS IS ALLOWED)
  const action = initialData
    ? updateDepartment.bind(null, initialData.id)
    : createDepartment

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Department" : "Add Department"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-6">
          <div>
            <label className="text-sm font-medium">Department Name</label>
            <Input
             {...register("name", { required: true })}
              placeholder="e.g. Computer Science"
              defaultValue={initialData?.name}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {initialData ? "Update Department" : "Create Department"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
