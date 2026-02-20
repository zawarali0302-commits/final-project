
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import {
    UserPlus,
    GraduationCap,
    School,
    FileText,
} from "lucide-react"

const actions = [
    {
        title: "Add Teacher",
        description: "Create a new teacher account",
        href: "/admin/teachers/create",
        icon: GraduationCap,
    },
    {
        title: "Add Student",
        description: "Enroll a new student",
        href: "/admin/students/create",
        icon: UserPlus,
    },
    {
        title: "Create Program",
        description: "Set up a new class",
        href: "/admin/programs/create",
        icon: School,
    },
    {
        title: "Generate Results",
        description: "Create result cards",
        href: "/admin/results",
        icon: FileText,
    },
]

export function QuickActions() {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">
                    Common tasks you can perform quickly
                </p>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
                {actions.map(action => {
                    const Icon = action.icon

                    return (
                        <Link key={action.title} href={action.href} className="h-full">
                            <Card
                                className={cn(
                                    "group h-full cursor-pointer transition-all duration-200",
                                    "hover:-translate-y-1 hover:shadow-lg",
                                    "focus-visible:ring-2 focus-visible:ring-primary"
                                )}
                            >

                                <CardContent className="p-4 h-full flex flex-col gap-3">

                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div
                                            className={cn(
                                                "rounded-lg bg-primary/10 p-2 shrink-0",
                                                "transition-transform duration-200",
                                                "group-hover:scale-110 group-hover:rotate-3"
                                            )}
                                        >
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>

                                        {/* Text */}
                                        <div>
                                            <p className="font-medium leading-tight">
                                                {action.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1" />

                                    {/* Arrow */}
                                    {/* <span
                                        className={cn(
                                            "text-xs text-muted-foreground inline-flex items-center gap-1",
                                            "transition-all duration-200",
                                            "group-hover:text-primary group-hover:translate-x-1"
                                        )}
                                    >
                                        Click to continue
                                        <span className="transition-transform group-hover:translate-x-1">→</span>
                                    </span> */}

                                </CardContent>

                            </Card>
                        </Link>
                    )
                })}
            </div>

        </div>
    )
}
