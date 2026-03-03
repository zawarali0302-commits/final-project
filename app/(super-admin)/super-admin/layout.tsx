'use client'

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", href: "/super-admin" },
  { label: "Institutes", href: "/super-admin/institutes" },
  { label: "Admins", href: "/super-admin/admins" },
  { label: "Settings", href: "/super-admin/settings" },
]

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className="w-64 bg-black text-white">
        <div className="p-6 text-xl font-bold">Resultify</div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition",
                pathname === item.href && "bg-white/10"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-col flex-1">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Super Admin Dashboard</h1>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
