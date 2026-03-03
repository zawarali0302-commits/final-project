"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useServerAction } from "@/hook/useServerAction"
import { createSession, updateSession } from "@/app/actions/session.actions"

interface SessionFormProps {
  instituteId: string
  programs: Array<{
    id: string
    name: string
  }>
  defaultProgramId?: string | null
  onSuccess?: () => void
  initialData?: {
    id: string
    name: string
    programId: string
    startYear: number
    endYear: number
  }
}

export default function SessionForm({
  instituteId,
  programs,
  defaultProgramId,
  onSuccess,
  initialData,
}: SessionFormProps) {

  const isEdit = !!initialData

  const [selectedProgram, setSelectedProgram] = useState(
    initialData?.programId ?? defaultProgramId ?? ""
  )

  const action = isEdit
    ? updateSession.bind(null, initialData!.id)
    : createSession

  const { execute, isPending } = useServerAction(action, {
    onSuccess,
  })

  return (
    <form action={execute} className="space-y-6 max-w-xl">

      {/* Hidden institute */}
      <input type="hidden" name="instituteId" value={instituteId} />

      {/* Session Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Session Name</label>
        <Input
          name="name"
          required
          defaultValue={initialData?.name}
          placeholder="BSCS 2024-2028"
        />
      </div>

      {/* Program */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Program</label>
        <Select
          name="programId"
          value={selectedProgram}
          onValueChange={setSelectedProgram}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent>
            {programs.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Start Year */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Start Year</label>
        <Input
          type="number"
          name="startYear"
          required
          defaultValue={initialData?.startYear}
          placeholder="2024"
        />
      </div>

      {/* End Year */}
      <div className="space-y-2">
        <label className="text-sm font-medium">End Year</label>
        <Input
          type="number"
          name="endYear"
          required
          defaultValue={initialData?.endYear}
          placeholder="2028"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending
          ? isEdit
            ? "Updating..."
            : "Creating..."
          : isEdit
          ? "Update Session"
          : "Create Session"}
      </Button>
    </form>
  )
}
