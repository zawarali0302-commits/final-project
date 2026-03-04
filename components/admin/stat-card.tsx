import { Card, CardContent } from "@/components/ui/card"
import { ReactNode } from "react"
import Link from "next/link"

interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: ReactNode
  viewAllHref?: string
  viewAllLabel?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  viewAllHref,
  viewAllLabel = "View all",
}: StatCardProps) {
  return (
    <Card className="group relative h-full overflow-hidden border-border/60 bg-card/90 py-0 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary/20 to-transparent" />
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="min-h-10 text-sm font-medium leading-5 text-muted-foreground">
              {title}
            </p>
            <h3 className="text-3xl font-semibold tracking-tight">{value}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border bg-muted/50">
              {icon}
            </div>
          )}
        </div>

        {viewAllHref && (
          <div className="mt-auto pt-4">
            <div className="border-t pt-3">
            <Link
              href={viewAllHref}
              className="text-xs font-medium text-muted-foreground transition hover:text-primary"
            >
              {viewAllLabel}
            </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
