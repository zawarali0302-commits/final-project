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
import { deleteTerm } from "@/app/actions/term.actions"

interface TermDropdownProps {
  termId: string
  programId: string
}

export function TermDropdown({ termId , programId }: TermDropdownProps) {
  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this term?"
    )
    if (!confirmed) return
    await deleteTerm(termId)
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
            pathname: `/admin/terms/${termId}`,
            query: { programId }
          }}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>

        {/* Edit Section */}
        <DropdownMenuItem asChild>
          <Link href={{
            pathname: `/admin/terms/${termId}/edit`,
            query: { programId }
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
