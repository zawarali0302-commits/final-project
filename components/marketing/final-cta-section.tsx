import Link from "next/link"
import { Button } from "@/components/ui/button"
import { currentUser } from "@clerk/nextjs/server"
import { UserRole } from "@/app/generated/prisma/enums"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { getDashboardUserByEmail } from "@/prisma/user.service"

const FinalCtaSection = async () => {
  const clerkUser = await currentUser()
  const isSignedIn = Boolean(clerkUser)
  let showRegisterInstitute = false

  if (clerkUser) {
    const email =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses[0]?.emailAddress

    if (email) {
      const dbUser = await getDashboardUserByEmail(email)

      showRegisterInstitute = !(
        dbUser?.role === UserRole.ADMIN && Boolean(dbUser.instituteId)
      )
    }
  }

  return (
    <section className="pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-3xl border bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-8 shadow-sm sm:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-3xl font-semibold">Ready To Modernize Result Management?</h3>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Start with your institute setup and move from manual spreadsheets to
              reliable digital workflows.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {showRegisterInstitute ? (
                <Button asChild>
                  <Link href="/register-institute">Register Institute</Link>
                </Button>
              ) : isSignedIn ? (
                <Button asChild>
                  <Link href="/">Open Dashboard</Link>
                </Button>
              ) : (
                <SignUpButton>
                  <Button>Sign Up To Get Started</Button>
                </SignUpButton>
              )}
              {!isSignedIn ? (
                <SignInButton>
                  <Button variant="outline">Login</Button>
                </SignInButton>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCtaSection
