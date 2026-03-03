"use client"

import { useState } from "react"
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
import { useServerAction } from "@/hook/useServerAction"

interface ProgramFormProps {
  departmentId: string
  redirectTo?: string
  onSuccess?: () => void
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
  redirectTo = `/admin/departments/${departmentId}`,
  onSuccess,
}: ProgramFormProps) {
  const [level, setLevel] = useState<ProgramLevel | "">(initialData?.level ?? "")
  const [system, setSystem] = useState<ProgramSystem | "">(initialData?.system ?? "")

  const action = initialData
    ? updateProgram.bind(null, initialData.id)
    : createProgram

  const { execute, isPending } = useServerAction(action, {
    redirectTo,
    onSuccess,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Program" : "Add Program"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form action={execute} className="space-y-6">
          {/* Name */}
          <Input
            name="name"
            defaultValue={initialData?.name}
            placeholder="Program name"
            required
          />

          {/* Hidden Department ID */}
          <input
            type="hidden"
            name="departmentId"
            value={departmentId}
          />

          <input type="hidden" name="level" value={level} />

          <input type="hidden" name="system" value={system} />

          {/* Level Select */}
          <Select
            value={level || undefined}
            onValueChange={(value) =>
              setLevel(value as ProgramLevel)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProgramLevel.INTERMEDIATE}>
                Intermediate
              </SelectItem>
              <SelectItem value={ProgramLevel.UNDERGRADUATE}>
                Undergraduate
              </SelectItem>
              <SelectItem value={ProgramLevel.POSTGRADUATE}>
                Postgraduate
              </SelectItem>
            </SelectContent>
          </Select>

          {/* System Select */}
          <Select
            value={system || undefined}
            onValueChange={(value) =>
              setSystem(value as ProgramSystem)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ProgramSystem.ANNUAL}>
                Annual
              </SelectItem>
              <SelectItem value={ProgramSystem.SEMESTER}>
                Semester
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !level || !system}>
              {isPending
                ? initialData
                  ? "Updating..."
                  : "Creating..."
                : initialData
                ? "Update Program"
                : "Create Program"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
