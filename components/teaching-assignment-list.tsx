import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteTeachingAssignment } from "@/app/actions/teacher.actions"

export function TeachingAssignmentsList({
  assignments,
}: {
  assignments: {
    id: string
    subject: { name: string }
    section: { name: string }
  }[]
}) {
  return (
    <div className="mt-6 space-y-2">
      {assignments.map((a) => (
        <div
          key={a.id}
          className="flex items-center justify-between border rounded p-3"
        >
          <div>
            <p className="font-medium">{a.subject.name}</p>
            <p className="text-sm text-muted-foreground">
              Section {a.section.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
