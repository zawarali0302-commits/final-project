"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { deleteStudent } from "@/app/actions/student.actions"

interface StudentDropdownProps {
  studentId: string
  sectionId: string
}

export function StudentDropdown({ studentId, sectionId }: StudentDropdownProps) {
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this student?")
    if (!confirmed) return

    await deleteStudent(studentId)
    // Optionally reload page
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/students/${studentId}/edit?sectionId=${sectionId}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
