"use client"

import { updateAdminInstituteProfile } from "@/app/actions/adminSettings.actions"
import { useServerAction } from "@/hook/useServerAction"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminSettingsFormProps {
  institute: {
    id: string
    name: string
    location: string
    type: "SCHOOL" | "COLLEGE" | "UNIVERSITY"
  }
}

export default function AdminSettingsForm({
  institute,
}: AdminSettingsFormProps) {
  const { execute: saveProfile, isPending: isProfileSaving } = useServerAction(
    updateAdminInstituteProfile
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Institute Profile</CardTitle>
          <CardDescription>
            Update basic organization information used across the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveProfile} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Institute Name</label>
                <Input
                  name="name"
                  required
                  defaultValue={institute.name}
                  placeholder="Enter institute name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Institute Type</label>
                <Select name="type" defaultValue={institute.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select institute type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCHOOL">School</SelectItem>
                    <SelectItem value="COLLEGE">College</SelectItem>
                    <SelectItem value="UNIVERSITY">University</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  name="location"
                  required
                  defaultValue={institute.location}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <Button type="submit" disabled={isProfileSaving}>
              {isProfileSaving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
