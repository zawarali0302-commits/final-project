import prisma from "@/lib/prisma";

export const getSessions = async () => {
  return prisma.session.findMany({
    include: {
      program: true,
      students: true,
    },
  });
};

export const getSessionsByInstitute = async (instituteId: string) => {
  return prisma.session.findMany({
    where: { program: { department: { instituteId } } },
    include: {
      program: true,
      students: true,
    },
  });
};

export const addSession = async (
  name: string,
  programId: string,
  instituteId: string,
  startYear: number,
  endYear: number
) => {
  return prisma.session.create({
    data: {
      name,
      programId,
      instituteId,
      startYear,
      endYear,
    },
  })
}

export const editSession = async (
  id: string,
  data: Partial<{
    name: string
    programId: string
    instituteId: string
    startYear: number
    endYear: number
  }>
) => {
  const session = await prisma.session.findUnique({
    where: { id },
  })

  if (!session) {
    throw new Error("Session not found")
  }
  return prisma.session.update({
    where: { id },
    data,
  })
}
