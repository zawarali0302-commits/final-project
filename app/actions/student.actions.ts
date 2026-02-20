"use server"

import { Gender, StudentStatus } from "@/app/generated/prisma/enums"
import { addStudent, editStudent, removeStudent } from "@/prisma/student.service"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export const createStudent = async (data: FormData) => {
  const rollNo = data.get("rollNo") as string
  const name = data.get("name") as string
  const gender = (data.get("gender") as Gender) || Gender.MALE
  const status = (data.get("status") as StudentStatus) || StudentStatus.ACTIVE
  const sectionId = data.get("sectionId") as string

  // Validation
  if (!rollNo || !name || !sectionId) {
    throw new Error("Missing required fields")
  }

  // Insert into DB
  await addStudent({
    rollNo,
    name,
    gender,
    status,
    sectionId,
  })

  redirect(`/admin/programs/${sectionId}/sections/${sectionId}`)
}

export const updateStudent = async (studentId: string, data: FormData) => {
  const name = data.get("name") as string
  const rollNo = data.get("rollNo") as string
  const gender = (data.get("gender") as Gender) || Gender.MALE
  const status = (data.get("status") as StudentStatus) || StudentStatus.ACTIVE
  const sectionId = data.get("sectionId") as string

  // Validation
  if (!rollNo || !name || !sectionId) {
    throw new Error("Missing required fields")
  }

  await editStudent(studentId, {
    rollNo,
    name,
    gender,
    status,
    sectionId,
  })

  redirect(`/admin/programs/${sectionId}/sections/${sectionId}`)
}

export const deleteStudent = async (studentId: string) => {
  await removeStudent(studentId)
  revalidatePath("/")
}