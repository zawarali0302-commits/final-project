import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardCheck,
  FileSpreadsheet,
} from "lucide-react"
import { getUserWithTeacherByEmail } from "@/prisma/user.service"

const TeacherPage = async () => {
  const clerkUser = await currentUser()

  if (!clerkUser?.id) {
    redirect("/sign-in")
  }

  const email = clerkUser.emailAddresses[0].emailAddress

  const user = await getUserWithTeacherByEmail(email)

  if (!user || user.role !== "TEACHER") {
    redirect("/")
  }

  const teacherName = user.teacher?.name || clerkUser.fullName

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Welcome
          </p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">{teacherName}</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Manage your courses, enter marks, and monitor academic progress.
          </p>
        </div>
      </section>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Quick Access</h2>
        <p className="text-sm text-muted-foreground">
          Continue your most common teaching workflows.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TeacherCard
          title="My Courses"
          description="View and manage your assigned courses."
          href="/teacher/courses"
          icon={<BookOpenCheck className="h-5 w-5 text-primary" />}
        />

        <TeacherCard
          title="Attendance"
          description="Record and manage attendance."
          href="/teacher/attendance"
          icon={<ClipboardCheck className="h-5 w-5 text-primary" />}
        />

        <TeacherCard
          title="View Results"
          description="Review submitted exam results."
          href="/teacher/results"
          icon={<FileSpreadsheet className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  )
}

function TeacherCard({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}) {
  return (
    <Card className="h-full border-border/70 bg-card/90 py-0 transition hover:-translate-y-1 hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-xl border bg-muted/70 p-2.5">{icon}</div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild className="mt-auto w-full">
          <Link href={href}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default TeacherPage
