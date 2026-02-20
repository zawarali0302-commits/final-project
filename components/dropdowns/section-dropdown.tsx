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
import { deleteSection } from "@/app/actions/section.actions"

interface SectionDropdownProps {
  sectionId: string
  termId: string
}

export function SectionDropdown({ sectionId, termId }: SectionDropdownProps) {
  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this section?"
    )
    if (!confirmed) return
    await deleteSection(sectionId)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* View Section */}
        <DropdownMenuItem asChild>
          <Link href={{
            pathname: `/admin/sections/${sectionId}`,
            query: { termId }
          }}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>

        {/* Edit Section */}
        <DropdownMenuItem asChild>
          <Link href={{
            pathname: `/admin/sections/${sectionId}/edit`,
            query: { termId }
          }}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        {/* Delete Section */}
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
