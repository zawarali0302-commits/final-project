import Link from "next/link"
import { Button } from "../ui/button"
import StatCard from "./stat-card"
import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { UserRole } from "@/app/generated/prisma/enums"

const stats = [
  {
    id: 1,
    value: "100+",
    label: "Institutions",
  },
  {
    id: 2,
    value: "50k+",
    label: "Students",
  },
  {
    id: 3,
    value: "99%",
    label: "Accuracy",
  },
  {
    id: 4,
    value: "24/7",
    label: "Availability",
  },
]

const HeroSection = async () => {
  const clerkUser = await currentUser()
  let showRegisterInstitute = false

  if (clerkUser) {
    const email =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress

    if (email) {
      const dbUser = await prisma.user.findUnique({
        where: { email },
        select: {
          role: true,
          instituteId: true,
        },
      })

      showRegisterInstitute = !(
        dbUser?.role === UserRole.ADMIN && Boolean(dbUser.instituteId)
      )
    }
  }

  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:gap-12 md:py-20">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Result Management Platform
        </p>
        <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
          Generate Student Result Cards
          <span className="mt-2 block text-muted-foreground">
            For Schools, Colleges, and Universities
          </span>
        </h2>
        <p className="mt-5 max-w-xl text-muted-foreground">
          A modern platform to create and manage official student result cards
          with secure workflows and consistent academic reporting.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {showRegisterInstitute && (
            <Button asChild>
              <Link href="/register-institute">Register Your Institute</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/login">Explore Dashboard</Link>
          </Button>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-4 rounded-3xl border bg-card/90 p-5 shadow-sm">
        {stats.map((stat) => (
          <li key={stat.id}>
            <StatCard value={stat.value} label={stat.label} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default HeroSection
