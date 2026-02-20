import { Card, CardContent } from "@/components/ui/card"
import { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon?: ReactNode
}

export function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden transition hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-6">
        
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
          {icon}
        </div>

        {/* Text */}
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
