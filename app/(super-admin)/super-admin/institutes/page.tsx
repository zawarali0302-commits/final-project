import { UserRole } from "@/app/generated/prisma/enums"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireRole } from "@/lib/requireRole"
import { getInstitutesPaginated } from "@/prisma/institute.service"
import Link from "next/link"
import { redirect } from "next/navigation"

interface SuperAdminInstitutesPageProps {
  searchParams?: Promise<{
    page?: string
  }>
}

export default async function SuperAdminInstitutesPage({
  searchParams,
}: SuperAdminInstitutesPageProps) {
  await requireRole([UserRole.SUPER_ADMIN])

  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const requestedPage = Number(resolvedSearchParams?.page ?? "1")
  const page = Number.isFinite(requestedPage) && requestedPage > 0
    ? Math.floor(requestedPage)
    : 1
  const pageSize = 10

  const { institutes, total } = await getInstitutesPaginated(page, pageSize)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (page > totalPages) {
    redirect(`/super-admin/institutes?page=${totalPages}`)
  }

  const startSerial = (page - 1) * pageSize

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
          <h2 className="text-2xl font-semibold sm:text-3xl">Institutes</h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            All registered institutes on the platform.
          </p>
        </div>
      </section>

      <Card className="border-border/70 py-0">
        <CardContent className="p-0">
          {institutes.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              No institutes found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Institute</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institutes.map((institute, index) => (
                  <TableRow key={institute.id}>
                    <TableCell>{startSerial + index + 1}</TableCell>
                    <TableCell className="font-medium">{institute.name}</TableCell>
                    <TableCell className="capitalize">
                      {institute.type.toLowerCase()}
                    </TableCell>
                    <TableCell>{institute.location}</TableCell>
                    <TableCell>
                      <Badge variant={institute.isActive ? "default" : "secondary"}>
                        {institute.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{institute._count.users}</TableCell>
                    <TableCell>
                      {new Date(institute.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={`/super-admin/institutes?page=${page - 1}`}>
                    Previous
                  </Link>
                </Button>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  Previous
                </Button>
              )}

              {page < totalPages ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={`/super-admin/institutes?page=${page + 1}`}>
                    Next
                  </Link>
                </Button>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
