"use client"

import Link from "next/link"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { deleteCourse } from "@/app/actions/course.actions"

interface CourseDropdownProps {
    courseId: string
    departmentId: string
}

export function CourseDropdown({ courseId, departmentId }: CourseDropdownProps) {
    const handleDelete = async () => {
        const confirmed = confirm(
            "Are you sure you want to delete this subject?"
        )

        if (!confirmed) return

        await deleteCourse(courseId)
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
                    <Link href={{
                        pathname: `/admin/courses/${courseId}/edit`,
                        query: {
                            departmentId
                        }
                    }}>
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
