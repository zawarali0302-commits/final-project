"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createCourse, updateCourse } from "@/app/actions/course.actions"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useServerAction } from "@/hook/useServerAction"

interface CourseFormProps {
  departmentId: string
  initialData?: {
    id: string
    name: string
    code: string
    credits?: number
    departmentId: string
  }
}

export function CourseForm({ departmentId, initialData }: CourseFormProps) {
  const action = initialData ? updateCourse.bind(null, initialData.id) : createCourse

  const { execute, isPending } = useServerAction(action)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Course" : "Add Course"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          action={execute}
          className="space-y-4 max-w-md"
        >
          {/* Course Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Course Name</label>
            <Input
              name="name"
              placeholder="Physics"
              defaultValue={initialData?.name}
              required
            />
          </div>

          {/* Course Code */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Course Code</label>
            <Input
              name="code"
              placeholder="PHY101"
              defaultValue={initialData?.code}
              required
            />
          </div>

          {/* Credits */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Credits</label>
            <Input
              name="credits"
              type="number"
              min={0}
              placeholder="3"
              defaultValue={initialData?.credits}
            />
          </div>
          {/* Hidden IDs */}
          <input type="hidden" name="departmentId" value={departmentId} />
          {/* Department Selection */}
          {/* <div className="space-y-1">
            <label className="text-sm font-medium">Department</label>
            <Select
              value={selectedDept}
              onValueChange={(val) => setSelectedDept(val)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          <Button type="submit" className="w-full " disabled={isPending}>
            {isPending
              ? initialData
                ? "Updating..."
                : "Creating..."
              : initialData
                ? "Update Course"
                : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>


  )
}
