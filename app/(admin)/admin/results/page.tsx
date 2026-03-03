import { UserRole } from "@/app/generated/prisma/enums"
import ComputeResultsButton from "@/components/forms/compute-results-button"
import PublishResultsButton from "@/components/forms/publish-results-button"
import { requireRole } from "@/lib/requireRole"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getResultControlEventsByInstitute } from "@/prisma/result.service"

export default async function AdminResultsPage() {
  const user = await requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN])

  if (!user.instituteId) {
    return <p>No institute found for current user.</p>
  }

  const examEvents = await getResultControlEventsByInstitute(user.instituteId)

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Result Control</h1>
        <p className="text-muted-foreground">
          Compute final results for each exam event after teachers submit all marks.
        </p>
      </div>

      {examEvents.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No exam events found yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {examEvents.map((event) => (
            (() => {
              const publishedCount = event.results.filter((r) => r.isPublished).length
              const hasResults = event._count.results > 0
              return (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>
                      {event.program.name} | {event.academicYear.name} | {event.type}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      <p>Course Exams: {event._count.courseExams}</p>
                      <p>Computed Results: {event._count.results}</p>
                      <p>
                        Published: {publishedCount}/{event._count.results}
                      </p>
                      <p>Status: {event.isLocked ? "Locked" : "Open"}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" disabled={!hasResults}>
                        <Link href={`/admin/results/${event.id}`}>View Result Cards</Link>
                      </Button>
                      <ComputeResultsButton
                        examEventId={event.id}
                        disabled={event._count.courseExams === 0}
                      />
                      <PublishResultsButton
                        examEventId={event.id}
                        published={true}
                        disabled={!hasResults}
                      />
                      <PublishResultsButton
                        examEventId={event.id}
                        published={false}
                        disabled={!hasResults}
                      />
                    </div>
                  </CardContent>
                </Card>
              )
            })()
          ))}
        </div>
      )}
    </div>
  )
}
