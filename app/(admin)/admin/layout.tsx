"use client"

import { ReactNode } from "react"
import {
  Building2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from "lucide-react"
import { RoleShell } from "@/components/layout/role-shell"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Departments", href: "/admin/departments", icon: Building2 },
    { label: "Programs", href: "/admin/programs", icon: Sparkles },
    { label: "Teachers", href: "/admin/teachers", icon: GraduationCap },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "Result Control", href: "/admin/results", icon: FileText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ]

  return (
    <RoleShell
      brand="Resultify"
      panelTitle="Admin Panel"
      sectionLabel="Administration"
      headerTitle="Dashboard"
      footerText="Manage your institute with confidence."
      navItems={navItems}
    >
      {children}
    </RoleShell>
  )
}
