"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createInstitute } from "@/app/actions/institute.actions"
import { useServerAction } from "@/hook/useServerAction"

export default function RegisterInstituteForm() {
  const action = createInstitute
  const { execute, isPending } = useServerAction(action, {
    redirectTo: "/admin",
  })
  return (
    <form action={execute} className="space-y-4">

      <div>
        <label className="block mb-1 font-medium">Institute Name</label>
        <Input
          name="name"   // ✅ IMPORTANT
          placeholder="Enter institute name"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Institute Type</label>
        <Select name="type" defaultValue="SCHOOL">
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SCHOOL">School</SelectItem>
            <SelectItem value="COLLEGE">College</SelectItem>
            <SelectItem value="UNIVERSITY">University</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Location</label>
        <Input
          name="location"  // ✅ IMPORTANT
          placeholder="Enter location"
          required
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Registering..." : "Register"}
      </Button>

    </form>
  )
}