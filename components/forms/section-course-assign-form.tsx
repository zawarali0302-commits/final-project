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
import { assignCourseToSection } from "@/app/actions/sectionCourse.actions"
import { useServerAction } from "@/hook/useServerAction"

interface TermCourse {
  id: string
  course: {
    name: string
    code: string
  }
}

interface AssignCourseToSectionFormProps {
  sectionId: string
  termCourses: TermCourse[]
  onAssigned?: () => void
}

export default function AssignCourseToSectionForm({
  sectionId,
  termCourses,
  onAssigned,
}: AssignCourseToSectionFormProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<TermCourse | null>(null)

  const { execute, isPending } = useServerAction(assignCourseToSection, {
    onSuccess: () => {
      setSelected(null)
      onAssigned?.()
    },
  })

  if (termCourses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No courses available for this term.
      </p>
    )
  }

  return (
    <div className="max-w-md space-y-4">
      <form action={execute} className="space-y-3">
        <input type="hidden" name="sectionId" value={sectionId} />
        <input type="hidden" name="courseOfferingId" value={selected?.id || ""} />

        {/* Searchable Course Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {selected
                ? `${selected.course.name} (${selected.course.code})`
                : "Select a course"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search course..." />
              <CommandEmpty>No course found.</CommandEmpty>

              <CommandGroup>
                {termCourses.map((offering) => (
                  <CommandItem
                    key={offering.id}
                    value={offering.course.name}
                    onSelect={() => {
                      setSelected(offering)
                      setOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{offering.course.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {offering.course.code}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        selected?.id === offering.id ? "opacity-100" : "opacity-0"
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
