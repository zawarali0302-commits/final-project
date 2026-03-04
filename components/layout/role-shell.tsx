"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type RoleShellNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

interface RoleShellProps {
  brand: string
  panelTitle: string
  sectionLabel: string
  headerTitle: string
  footerText: string
  navItems: RoleShellNavItem[]
  children: ReactNode
}

export function RoleShell({
  brand,
  panelTitle,
  sectionLabel,
  headerTitle,
  footerText,
  navItems,
  children,
}: RoleShellProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--muted))_0%,hsl(var(--background))_55%)]">
      <div className="mx-auto flex w-full max-w-400 gap-4 px-4 py-4 sm:px-6 lg:gap-6 lg:py-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-72 shrink-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-zinc-100 shadow-xl lg:flex">
          <div className="border-b border-white/10 px-6 py-6">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              {brand}
            </p>
            <h1 className="mt-2 text-lg font-semibold">{panelTitle}</h1>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {navItems.map((item) => {
              const isActive =
                item.href === pathname || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                    "hover:bg-white/10 hover:text-white",
                    isActive ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-300"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-white/10 px-6 py-4 text-xs text-zinc-400">
            {footerText}
          </div>
        </aside>

        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col overflow-hidden rounded-3xl border bg-background/90 shadow-sm backdrop-blur">
          <header className="border-b bg-background/95">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {sectionLabel}
                </p>
                <h2 className="text-base font-semibold sm:text-lg">{headerTitle}</h2>
              </div>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            <nav className="flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:hidden">
              {navItems.map((item) => {
                const isActive =
                  item.href === pathname || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
