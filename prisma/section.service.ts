import prisma from "@/lib/prisma"

// --- Get all sections ---
export async function getSections() {
  return prisma.section.findMany({
    include: {
      term: {
        include: {
          program: true,
          academicYear: true,
        },
      },
      studentEnrollments: {
        include: {
          student: {
            include: {
              session: true, // includes batch/session info
            },
          },
          section: true, // optional
        },
      },
      sectionCourses: {
        include: {
          teacher: true,
          courseOffering: {
            include: {
              course: true,
            },
          }
        },
      },
    },
  })
}

export async function getSectionsByInstitute(instituteId: string) {
  return prisma.section.findMany({
    where: { term: { program: { 
      department: { instituteId }
     } } },
    include: {
      term: {
        include: {
          program: true,
          academicYear: true,
        },
      },
      studentEnrollments: {
        include: {
          student: {
            include: {
              session: true,
            },
          },
        },
      },
      sectionCourses: {
        include: {
          teacher: true,
          courseOffering: {
            include: {
              course: true,
            },
          }
        },
      },
    },
  })
}

// --- Get section by ID with all necessary relations ---
export async function getSectionById(id: string) {
  return prisma.section.findUnique({
    where: { id },
    include: {
      term: {
        include: {
          program: true,
          academicYear: true,
        },
      },
      studentEnrollments: {
        include: {
          student: {
            include: {
              session: true,
            },
          },
        },
      },
      sectionCourses: {
        include: {
          teacher: true,
          courseOffering: {
            include: {
              course: true,
            },
          }
        },
      },
    },
  })
}

// --- Get sections for a term ---
export async function getSectionsByTerm(termId: string) {
  return prisma.section.findMany({
    where: { termId },
    include: {
      term: {
        include: {
          program: true,
          academicYear: true,
        },
      },
      studentEnrollments: {
        include: {
          student: {
            include: {
              session: true,
            },
          },
        },
      },
      sectionCourses: {
        include: {
          teacher: true,
          courseOffering: {
            include: {
              course: true,
            },
          }
        },
      },
    },
  })
}

// --- Add section ---
export async function addSection(name: string, termId: string) {
  return prisma.section.create({
    data: {
      name,
      termId,
    },
  })
}

// --- Edit section ---
export async function editSection(
  id: string,
  data: { name?: string; termId?: string }
) {
  const section = await prisma.section.findUnique({ where: { id } })
  if (!section) throw new Error("Section not found")

  return prisma.section.update({
    where: { id },
    data,
  })
}

// --- Remove section ---
export async function removeSection(id: string) {
  const section = await prisma.section.findUnique({ where: { id } })
  if (!section) throw new Error("Section not found")
  if (section.name === "Default") throw new Error("Default section cannot be deleted")

  return prisma.section.delete({ where: { id } })
}
