import prisma from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const Page = async () => {
  const clerkUser = await currentUser()

  if (!clerkUser?.id) {
    redirect("/sign-in")
  }

  const email = clerkUser.emailAddresses[0].emailAddress

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      teacher: true,
    },
  })

  if (!user || user.role !== "TEACHER") {
    redirect("/")
  }

  const teacherName = user.teacher?.name || clerkUser.fullName

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Welcome */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">
          Welcome, {teacherName} 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your courses, enter student marks, and track academic progress.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">

        <TeacherCard
          title="My Courses"
          description="View and manage your assigned courses."
          href="/teacher/courses"
        />

        <TeacherCard
          title="Attendance"
          description="Record and manage attendance."
          href="/teacher/attendance"
        />

        <TeacherCard
          title="View Results"
          description="Review submitted exam results."
          href="/teacher/results"
        />

      </div>

    </div>
  )
}

function TeacherCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button asChild className="w-full">
          <Link href={href}>Open</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default Page