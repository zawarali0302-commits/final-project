import { UserRole } from "@/app/generated/prisma/enums"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma"
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import DashboardButton from "../dashboard-button"

const Header = () => {
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-linear-to-br from-black to-gray-800 text-white flex items-center justify-center font-bold tracking-tight">
            SR
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold group-hover:opacity-90">
              Resultify
            </h1>
            <p className="text-xs text-gray-500">
              Academic Result Management
            </p>
          </div>
        </Link>

        {/* Actions */}
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