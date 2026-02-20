"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gender, StudentStatus } from "@/app/generated/prisma/enums"
import { createStudent, updateStudent } from "@/app/actions/student.actions"

interface StudentFormProps {
  sectionId?: string // pre-selected section
  initialData?: {
    id: string
    name: string
    rollNo: string
    gender: Gender
    status: StudentStatus
    sectionId: string
  }
}

export function StudentForm({ sectionId, initialData }: StudentFormProps) {
  const action = initialData ? updateStudent.bind(null, initialData.id) : createStudent

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Student" : "Add Student"}</CardTitle>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-6">
          {/* Roll Number */}
          <div>
            <label className="text-sm font-medium">Roll Number</label>
            <Input
              name="rollNo"
              placeholder="e.g. 101"
              defaultValue={initialData?.rollNo}
              required
            />
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium">Student Name</label>
            <Input
              name="name"
              placeholder="e.g. John Doe"
              defaultValue={initialData?.name}
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-sm font-medium">Gender</label>
            <Select name="gender" defaultValue={initialData?.gender || Gender.MALE} required>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Gender.MALE}>Male</SelectItem>
                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                <SelectItem value={Gender.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select name="status" defaultValue={initialData?.status || StudentStatus.ACTIVE} required>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={StudentStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={StudentStatus.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hidden Section ID */}
          <input
            type="hidden"
            name="sectionId"
            value={sectionId || initialData?.sectionId || ""}
            required
          />

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="submit">{initialData ? "Update Student" : "Add Student"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
