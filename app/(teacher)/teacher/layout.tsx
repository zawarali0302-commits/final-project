"use client"

import { ReactNode } from "react"
import {
  BookOpenCheck,
  ClipboardCheck,
  FileSpreadsheet,
  LayoutDashboard,
  LibraryBig,
  UserCircle2,
} from "lucide-react"
import { RoleShell } from "@/components/layout/role-shell"

const navItems = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "My Courses", href: "/teacher/courses", icon: LibraryBig },
  { label: "Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
  { label: "Exams", href: "/teacher/exams", icon: FileSpreadsheet },
  { label: "Results", href: "/teacher/results", icon: BookOpenCheck },
  { label: "Profile", href: "/teacher/profile", icon: UserCircle2 },
]

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <RoleShell
      brand="Resultify"
      panelTitle="Teacher Panel"
      sectionLabel="Teaching"
      headerTitle="Dashboard"
      footerText="Track courses, marks, and student progress."
      navItems={navItems}
    >
      {children}
    </RoleShell>
  )
}
