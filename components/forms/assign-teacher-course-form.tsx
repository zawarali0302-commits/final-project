"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { updateSectionCourseTeacher } from "@/app/actions/sectionCourse.actions"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useServerAction } from "@/hook/useServerAction"

interface Teacher {
  id: string
  name: string
  department: {
    id: string
    name: string
  }
}

interface SectionCourse {
  id: string
  teacherId: string | null
  teacher: {
    name: string
  } | null
  courseOffering: {
    course: {
      name: string
      department: {
        id: string
        name: string
      }
    }
  }
}

interface AssignTeachersFormProps {
  sectionId: string
  sectionCourses: SectionCourse[]
  teachers: Teacher[]
}

export default function AssignTeachersToSectionCoursesForm({
  sectionId,
  sectionCourses,
  teachers,
}: AssignTeachersFormProps) {
  // NOTE: move useServerAction into each row so pending state is local per-row

  if (sectionCourses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No courses assigned to this section.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Teacher</TableHead>
          <TableHead>Assign Teacher</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sectionCourses
          .slice()
          .sort((a, b) =>
            (a.courseOffering.course.name || "").localeCompare(
              b.courseOffering.course.name || ""
            )
          )
          .map((sc) => {
          // filter teachers to only those in the same department as the course
          const filteredTeachers = teachers.filter(
            (t) => t.department?.id === sc.courseOffering.course.department?.id
          )

          return (
            <TableRow key={sc.id}>
              <TableCell>
                {sc.courseOffering.course.name}
              </TableCell>

              <TableCell>
                {sc.teacher ? sc.teacher.name : "Not Assigned"}
              </TableCell>

              <TableCell>
                <SearchableTeacherRow
                  sectionCourseId={sc.id}
                  sectionId={sectionId}
                  teachers={filteredTeachers}
                  defaultTeacherId={sc.teacherId ?? ""}
                />
              </TableCell>
            </TableRow>
          )
          })}
      </TableBody>
    </Table>
  )
}

interface SearchableTeacherRowProps {
  sectionCourseId: string
  sectionId: string
  teachers: Teacher[]
  defaultTeacherId: string
}

function SearchableTeacherRow({
  sectionCourseId,
  sectionId,
  teachers,
  defaultTeacherId,
}: SearchableTeacherRowProps) {
  const { execute, isPending } = useServerAction(updateSectionCourseTeacher)

  const [open, setOpen] = useState(false)

  const [selected, setSelected] = useState<Teacher | null>(
    teachers.find((t) => t.id === defaultTeacherId) || null
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("sectionCourseId", sectionCourseId)
        formData.append("sectionId", sectionId)
        formData.append("teacherId", selected?.id || "")

        execute(formData)
      }}
      className="flex items-center gap-2"
    >

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="sm"
            className="w-55 justify-between"
          >
            {selected ? selected.name : "Not Assigned"}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

    <PopoverContent className="w-55 p-0">
          <Command>
            <CommandInput placeholder="Search teacher..." />
      <CommandEmpty>No teacher found.</CommandEmpty>

            <CommandGroup>
              {/* Unassign option */}
              <CommandItem
                value="Not Assigned"
                onSelect={() => {
                  setSelected(null)
                  setOpen(false)
                }}
              >
                <span>Not Assigned</span>
                <Check
                  className={cn(
                    "ml-auto",
                    selected === null ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {teachers.length === 0 ? (
                <div className="px-4 py-2 text-sm text-muted-foreground">No teachers in this department.</div>
              ) : (
                teachers.map((teacher) => (
                <CommandItem
                  key={teacher.id}
                  value={teacher.name}
                  onSelect={() => {
                    setSelected(teacher)
                    setOpen(false)
                  }}
                >
                  <span>{teacher.name}</span>
                  <Check
                    className={cn(
                      "ml-auto",
                      selected?.id === teacher.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
                ))
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

  <Button size="sm" type="submit" disabled={isPending || (teachers.length === 0 && selected === null)}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  )
}