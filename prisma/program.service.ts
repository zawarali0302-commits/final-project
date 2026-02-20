import { ProgramLevel, ProgramSystem } from "@/app/generated/prisma/enums"
import prisma from "@/lib/prisma"

// --- Get all programs with their departments ---
export const getPrograms = async () => {
  return prisma.program.findMany({
    include: {
      department: true,
    },
  })
}

// --- Get a program by ID with nested terms, sections, and counts ---
export const getProgramById = async (id: string) => {
  return prisma.program.findUnique({
    where: { id },
    include: {
      department: true,
      terms: {
        include: {
          academicYear: true,
          sections: {
            include: {
              _count: {
                select: {
                  studentEnrollments: true, // fixed: count students via enrollments
                },
              },
            },
          },
        },
      },
      sessions: true, // include batches/sessions if needed
      students: true, // include enrolled students if needed
    },
  })
}

// --- Add a program ---
export const addProgram = async (
  name: string,
  level: ProgramLevel,
  system: ProgramSystem,
  departmentId: string
) => {
  return prisma.program.create({
    data: {
      name,
      level,
      system,
      departmentId,
    },
  })
}

// --- Edit a program ---
export const editProgram = async (
  id: string,
  data: Partial<{
    name: string
    level: ProgramLevel
    system: ProgramSystem
    departmentId: string
  }>
) => {
  // Check if program exists
  const program = await prisma.program.findUnique({ where: { id } })
  if (!program) throw new Error("Program not found")

  return prisma.program.update({
    where: { id },
    data,
  })
}

// --- Remove a program ---
export const removeProgram = async (id: string) => {
  // Optional: check for existing students or sessions before deleting
  const program = await prisma.program.findUnique({ where: { id } })
  if (!program) throw new Error("Program not found")

  return prisma.program.delete({ where: { id } })
}
