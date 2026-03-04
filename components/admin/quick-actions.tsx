import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, FileText, GraduationCap, School, UserPlus } from "lucide-react"

const actions = [
  {
    title: "Add Teacher",
    description: "Create and assign a new faculty profile.",
    href: "/admin/teachers/create",
    icon: GraduationCap,
  },
  {
    title: "Add Student",
    description: "Enroll a student with institute details.",
    href: "/admin/students/create",
    icon: UserPlus,
  },
  {
    title: "Create Exam",
    description: "Open a new exam cycle and attach courses.",
    href: "/admin/exams/create",
    icon: School,
  },
  {
    title: "Generate Results",
    description: "Compute and publish result cards.",
    href: "/admin/results",
    icon: FileText,
  },
]

export function QuickActions() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">
            Common tasks to keep your workflow moving.
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 items-stretch">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <Link key={action.title} href={action.href} className="group h-full">
              <Card
                className={cn(
                  "h-full border-border/70 bg-card/90 py-0 transition-all duration-200",
                  "hover:-translate-y-1 hover:shadow-md"
                )}
              >
                <CardContent className="flex h-full flex-col gap-5 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-xl border bg-muted/70 p-2.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-medium leading-tight">{action.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
