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
import { deleteProgram } from "@/app/actions/program.actions"


export function ProgramDropdown({ id }: { id: string }) {
    const handleDelete = async () => {
        const confirmed = confirm(
            "Are you sure you want to delete this program?"
        )

        if (!confirmed) return

        await deleteProgram(id)
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
                    <Link href={`/admin/programs/${id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href={`/admin/programs/${id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                </DropdownMenuItem>

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
