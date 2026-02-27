'use client'

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SignedIn, UserButton } from "@clerk/nextjs"

const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Departments", href: `/admin/departments` },
    { label: "Programs", href: "/admin/programs" },
    { label: "Courses", href: "/admin/courses" },
    { label: "Teachers", href: "/admin/teachers" },
    { label: "Students", href: "/admin/students" },
    { label: "Result Control", href: "/admin/results" }, // NOT data entry
    { label: "Settings", href: "/admin/settings" },
]

export default function AdminClientLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-muted">
            {/* Sidebar */}
            <aside className="w-64 bg-black text-white">
                <div className="p-6 text-xl font-bold">Resultify</div>
                <nav className="px-4 space-y-1">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "block rounded-lg px-4 py-2 text-sm hover:bg-white/10",
                                pathname === item.href && "bg-white/10"
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex flex-col flex-1">
                <header className="h-16 bg-white border-b flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                    <div className="text-sm text-muted-foreground">
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>

                </header>

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}