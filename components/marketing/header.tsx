import { Button } from "@/components/ui/button"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"
import Link from "next/link"
import DashboardButton from "../dashboard-button"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">

        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 font-bold tracking-tight text-white">
            RF
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold group-hover:opacity-90">Resultify</h1>
            <p className="text-xs text-muted-foreground">Academic Result Management</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton>
              <Button variant="ghost">Login</Button>
            </SignInButton>

            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <DashboardButton />
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}

export default Header
