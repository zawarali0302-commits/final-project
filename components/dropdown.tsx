"use client"

import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import Link from "next/link"
import { UrlObject } from "url"
import { useServerAction } from "@/hook/useServerAction"

interface DropdownProps {
  id: string
  viewRoute: string | UrlObject
  editRoute: string | UrlObject
  deleteAction: (id: string) => Promise<{
    success: boolean
    message: string
  }>
}

const Dropdown = ({ id, viewRoute, editRoute, deleteAction }: DropdownProps) => {
  const { execute, isPending } = useServerAction(deleteAction)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={viewRoute}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href={editRoute}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isPending}
          onClick={() => execute(id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          {isPending ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Dropdown