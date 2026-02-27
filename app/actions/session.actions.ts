"use server"

import { addSession, editSession } from "@/prisma/session.service"

export async function createSession(data: FormData) {
  const name = data.get("name") as string
  const programId = data.get("programId") as string
  const instituteId = data.get("instituteId") as string
  const startYear = Number(data.get("startYear"))
  const endYear = Number(data.get("endYear"))

  if (!name || !programId || !instituteId || !startYear || !endYear) {
    return { success: false, message: "All fields are required" }
  }

  try {
    await addSession(name, programId, instituteId, startYear, endYear)
    return { success: true, message: "Session created successfully" }
  } catch (error) {
    return { success: false, message: "Unknown error" }
  }
}

export async function updateSession(sessionId: string, data: FormData) {
  const name = data.get("name") as string
  const programId = data.get("programId") as string
  const instituteId = data.get("instituteId") as string
  const startYear = Number(data.get("startYear"))
  const endYear = Number(data.get("endYear"))

  try {
    await editSession(sessionId, {
      name,
      programId,
      instituteId,
      startYear,
      endYear,
    })
    return { success: true, message: "Session updated successfully" }
  } catch (error) {
    return { success: false, message: "Unknown error" }
  }
}