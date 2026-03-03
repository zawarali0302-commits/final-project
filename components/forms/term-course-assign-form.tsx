"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command"
import { cn } from "@/lib/utils"
import { assignCourseToTerm } from "@/app/actions/courseOffering.actions"
import { useServerAction } from "@/hook/useServerAction"

interface Course {
  id: string
  name: string
  code?: string
  department?: {
    name: string
  }
}

interface AssignCourseToTermFormProps {
  termId: string
  courses: Course[]
  onAssigned?: () => void
}

export default function AssignCourseToTermForm({
  termId,
  courses,
  onAssigned,
}: AssignCourseToTermFormProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Course | null>(null)

  const { execute, isPending } = useServerAction(assignCourseToTerm, {
    onSuccess: () => {
      setSelected(null)
      onAssigned?.()
    },
  })

  return (
    <div className="max-w-md space-y-4">
      <form action={execute} className="space-y-3">
        <input type="hidden" name="termId" value={termId} />
        <input type="hidden" name="courseId" value={selected?.id || ""} />

        {/* Searchable Course Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {selected ? selected.name : "Select Course"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search course..." />
              <CommandEmpty>No course found.</CommandEmpty>

              <CommandGroup>
                {courses.map((course) => (
                  <CommandItem
                    key={course.id}
                    value={course.name}
                    onSelect={() => {
                      setSelected(course)
                      setOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{course.name}</span>
                      {course.code && (
                        <span className="text-xs text-muted-foreground">
                          {course.code} {course.department?.name ? `| ${course.department.name}` : ""}
                        </span>
                      )}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        selected?.id === course.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Button type="submit" disabled={!selected || isPending} className="w-full">
          {isPending ? "Assigning..." : "Assign"}
        </Button>
      </form>
    </div>
  )
}
