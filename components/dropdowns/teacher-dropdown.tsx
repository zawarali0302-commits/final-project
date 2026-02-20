"use client"

import Link from "next/link"
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { deleteTeacher } from "@/app/actions/teacher.actions"

export function TeacherDropdown({ id }: { id: string }) {
  const handleDelete = async () => {
          const confirmed = confirm(
              "Are you sure you want to delete this teacher?"
          )
  
          if (!confirmed) return
  
          await deleteTeacher(id)
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
          <Link href={`/admin/teachers/${id}`}>
          <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={`/admin/teachers/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
