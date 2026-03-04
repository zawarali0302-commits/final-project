import { Gender, StudentStatus } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const getStudents = async () => {
  return await prisma.student.findMany({
    include: {
      institute: true,
      program: true,
      session: true,
      studentEnrollments: {
        include: {
          section: {
            include: {
              term: true,
            },
          },
          courseOffering: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });
};

export const getStudentsByInstitute = async (instituteId: string) => {
  const students = await prisma.student.findMany({
    where: { instituteId },
    include: {
      program: true,
      session: true,
      studentEnrollments: {
        include: {
          section: {
            include: {
              term: true,
            },
          },
          courseOffering: {
            include: {
              course: true,
            },
          },
        },
      },
    },
  });

  return students.sort((a, b) =>
    a.rollNo.localeCompare(b.rollNo, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );
};

export const getStudentById = async (id: string) => {
  return await prisma.student.findUnique({
    where: { id },
    include: {
      program: {
        include: {
          department: true,
        },
      },
      studentEnrollments: {
        include: {
          section: {
            include: {
              term: true,
              sectionCourses: {
                include: {
                  courseOffering: {
                    include: {
                      course: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

interface CreateStudentInput {
  rollNo: string;
  name: string;
  gender: Gender;
  instituteId: string;
  programId: string;
  sessionId: string;
  sectionId: string;
}

export async function createStudentWithEnrollment(data: CreateStudentInput) {
  const { rollNo, name, gender, instituteId, programId, sessionId, sectionId } = data;

  return await prisma.$transaction(async (tx) => {
    const program = await tx.program.findUnique({
      where: { id: programId },
    });

    if (!program) {
      throw new Error("Program not found");
    }

    const session = await tx.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.programId !== programId) {
      throw new Error("Invalid session for selected program");
    }

    const section = await tx.section.findUnique({
      where: { id: sectionId },
      include: {
        term: {
          include: {
            courseOfferings: true,
          },
        },
      },
    });

    if (!section) {
      throw new Error("Section not found");
    }

    if (section.term.programId !== programId) {
      throw new Error("Section does not belong to selected program");
    }

    const existingStudent = await tx.student.findUnique({
      where: {
        rollNo_instituteId_sessionId: {
          rollNo,
          instituteId,
          sessionId,
        },
      },
    });

    if (existingStudent) {
      throw new Error("Student with this roll number already exists in the selected session");
    }

    if (section.term.courseOfferings.length === 0) {
      throw new Error(
        "No courses are offered in the selected term. Assign courses to the term before adding students."
      );
    }

    const student = await tx.student.create({
      data: {
        rollNo,
        name,
        gender,
        status: StudentStatus.ACTIVE,
        instituteId,
        programId,
        sessionId,
      },
    });

    await tx.studentEnrollment.createMany({
      data: section.term.courseOfferings.map((offering) => ({
        studentId: student.id,
        courseOfferingId: offering.id,
        sectionId: section.id,
      })),
    });

    return student;
  });
}

export const updateStudentWithEnrollment = async (
  id: string,
  data: {
    name: string;
    rollNo: string;
    gender: Gender;
    status: StudentStatus;
    sessionId: string;
    instituteId: string;
    programId: string;
    sectionId: string;
  }
) => {
  return await prisma.$transaction(async (tx) => {
    const section = await tx.section.findUnique({
      where: { id: data.sectionId },
      include: {
        term: {
          include: {
            courseOfferings: true,
          },
        },
      },
    });

    if (!section) {
      throw new Error("Section not found");
    }

    if (section.term.programId !== data.programId) {
      throw new Error("Section does not belong to selected program");
    }

    if (section.term.courseOfferings.length === 0) {
      throw new Error(
        "No courses are offered in the selected term. Assign courses to the term before updating student section enrollment."
      );
    }

    const student = await tx.student.update({
      where: { id },
      data: {
        name: data.name,
        rollNo: data.rollNo,
        gender: data.gender,
        status: data.status,
        sessionId: data.sessionId,
        instituteId: data.instituteId,
        programId: data.programId,
      },
    });

    await tx.studentEnrollment.deleteMany({
      where: { studentId: id },
    });

    await tx.studentEnrollment.createMany({
      data: section.term.courseOfferings.map((offering) => ({
        studentId: id,
        courseOfferingId: offering.id,
        sectionId: section.id,
      })),
    });

    return student;
  });
};

export const removeStudent = async (id: string) => {
  return await prisma.student.delete({
    where: { id },
  });
};
