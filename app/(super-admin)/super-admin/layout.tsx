"use client"

import { ReactNode } from "react"
import { Building2, LayoutDashboard, Settings, ShieldCheck } from "lucide-react"
import { RoleShell } from "@/components/layout/role-shell"

const navItems = [
  { label: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { label: "Institutes", href: "/super-admin/institutes", icon: Building2 },
  { label: "Admins", href: "/super-admin/admins", icon: ShieldCheck },
  { label: "Settings", href: "/super-admin/settings", icon: Settings },
]

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <RoleShell
      brand="Resultify"
      panelTitle="Super Admin"
      sectionLabel="Platform"
      headerTitle="Control Center"
      footerText="Govern institutions and platform access."
      navItems={navItems}
    >
      {children}
    </RoleShell>
  )
}
