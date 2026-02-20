"use client"

import { createSection, updateSection } from "@/app/actions/section.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface SectionFormProps {
  termId: string
  initialData?: {
    id: string
    name: string
  }
}

export function SectionForm({ termId, initialData }: SectionFormProps) {
  const action = initialData
    ? updateSection.bind(null, initialData.id)
    : createSection

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? "Edit Section" : "Add Section"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form action={action} className="space-y-6">
          {/* Hidden termId */}
          <input type="hidden" name="termId" value={termId} />

          <Input
            name="name"
            placeholder="Section name (A, B, C)"
            defaultValue={initialData?.name}
            required
          />

          <div className="flex justify-end">
            <Button type="submit">
              {initialData ? "Update Section" : "Create Section"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
