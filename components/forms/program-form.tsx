"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProgramLevel, ProgramSystem } from "@/app/generated/prisma/enums"
import { createProgram, updateProgram } from "@/app/actions/program.actions"

interface ProgramFormProps {
  departmentId: string
  initialData?: {
    id: string
    name: string
    level: ProgramLevel
    system: ProgramSystem
    departmentId: string
  }
}

export function ProgramForm({
  departmentId,
  initialData,
}: ProgramFormProps) {
   // bind server action (THIS IS ALLOWED)
    const action = initialData
      ? updateProgram.bind(null, initialData.id)
      : createProgram

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Program" : "Add Program"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          action={action}
          className="space-y-6"
        >
          <Input
            name="name"
            placeholder="Program name"
            defaultValue={initialData?.name}
            required
          />

          {/* Hidden IDs */}
          <input type="hidden" name="departmentId" value={departmentId} />

          <Select name="level" defaultValue={initialData?.level}>
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProgramLevel.INTERMEDIATE}>Intermediate</SelectItem>
              <SelectItem value={ProgramLevel.UNDERGRADUATE}>Undergraduate</SelectItem>
              <SelectItem value={ProgramLevel.POSTGRADUATE}>Postgraduate</SelectItem>
            </SelectContent>
          </Select>

          <Select name="system" defaultValue={initialData?.system}>
            <SelectTrigger>
              <SelectValue placeholder="Select system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProgramSystem.ANNUAL}>Annual</SelectItem>
              <SelectItem value={ProgramSystem.SEMESTER}>Semester</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end">
            <Button type="submit" >
              {initialData ? "Update Program" : "Create Program"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
