"use server";

import { revalidatePath } from "next/cache";
import { Gender, StudentStatus } from "../generated/prisma/enums";
import { createStudentWithEnrollment, removeStudent, updateStudentWithEnrollment } from "@/prisma/student.service";

type ParsedImportRow = {
  rollNo: string
  name: string
  gender: string
}

type BulkImportError = {
  row: number
  rollNo: string
  reason: string
}

const REQUIRED_IMPORT_HEADERS = ["rollNo", "name", "gender"] as const

const normalizeHeader = (header: string) =>
  header.replace(/\uFEFF/g, "").trim().toLowerCase().replace(/\s+/g, "")

const mapHeaderToField = (header: string): keyof ParsedImportRow | null => {
  const normalized = normalizeHeader(header)

  if (normalized === "rollno" || normalized === "rollnumber") return "rollNo"
  if (normalized === "name" || normalized === "fullname" || normalized === "studentname") return "name"
  if (normalized === "gender" || normalized === "sex") return "gender"

  return null
}

const parseCsvLine = (line: string) => {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const next = line[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === "," && !inQuotes) {
      values.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

const parseCsvRows = (content: string): ParsedImportRow[] => {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    throw new Error("The uploaded CSV is empty")
  }

  const headers = parseCsvLine(lines[0])
  const mappedHeaders = headers.map(mapHeaderToField)
  const mappedHeaderSet = new Set(mappedHeaders.filter((h): h is keyof ParsedImportRow => h !== null))

  for (const requiredHeader of REQUIRED_IMPORT_HEADERS) {
    if (!mappedHeaderSet.has(requiredHeader)) {
      throw new Error(
        `Missing required column: ${requiredHeader}. Required columns are: ${REQUIRED_IMPORT_HEADERS.join(", ")}`
      )
    }
  }

  const rows: ParsedImportRow[] = []

  for (let i = 1; i < lines.length; i += 1) {
    const values = parseCsvLine(lines[i])
    const row: ParsedImportRow = { rollNo: "", name: "", gender: "" }

    mappedHeaders.forEach((mappedHeader, index) => {
      if (!mappedHeader) return
      row[mappedHeader] = (values[index] ?? "").trim()
    })

    rows.push(row)
  }

  return rows
}

const parseExcelRows = async (file: File): Promise<ParsedImportRow[]> => {
  let xlsx: typeof import("xlsx")

  try {
    xlsx = await import("xlsx")
  } catch {
    throw new Error("Excel import requires the xlsx package. Install it with: npm i xlsx")
  }

  const arrayBuffer = await file.arrayBuffer()
  const workbook = xlsx.read(new Uint8Array(arrayBuffer), { type: "array" })
  const firstSheetName = workbook.SheetNames[0]

  if (!firstSheetName) {
    throw new Error("The uploaded Excel file has no sheets")
  }

  const sheet = workbook.Sheets[firstSheetName]
  const records = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" })

  if (records.length === 0) {
    throw new Error("The uploaded Excel sheet is empty")
  }

  const firstRecordKeys = Object.keys(records[0] ?? {})
  const mappedHeaders = firstRecordKeys.map(mapHeaderToField)
  const mappedHeaderSet = new Set(mappedHeaders.filter((h): h is keyof ParsedImportRow => h !== null))

  for (const requiredHeader of REQUIRED_IMPORT_HEADERS) {
    if (!mappedHeaderSet.has(requiredHeader)) {
      throw new Error(
        `Missing required column: ${requiredHeader}. Required columns are: ${REQUIRED_IMPORT_HEADERS.join(", ")}`
      )
    }
  }

  return records.map((record) => {
    const row: ParsedImportRow = { rollNo: "", name: "", gender: "" }

    firstRecordKeys.forEach((originalKey, index) => {
      const mappedHeader = mappedHeaders[index]
      if (!mappedHeader) return

      const value = record[originalKey]
      row[mappedHeader] = String(value ?? "").trim()
    })

    return row
  })
}

const parseImportFile = async (file: File): Promise<ParsedImportRow[]> => {
  const filename = file.name.toLowerCase()

  if (filename.endsWith(".csv")) {
    const content = await file.text()
    return parseCsvRows(content)
  }

  if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
    return parseExcelRows(file)
  }

  throw new Error("Unsupported file type. Upload a .csv, .xlsx, or .xls file")
}

const normalizeGender = (value: string): Gender | null => {
  const normalized = value.trim().toUpperCase()
  if (normalized === Gender.MALE) return Gender.MALE
  if (normalized === Gender.FEMALE) return Gender.FEMALE
  if (normalized === Gender.OTHER) return Gender.OTHER
  return null
}

export const createStudent = async (data: FormData) => {
  const rollNo = data.get("rollNo") as string;
  const name = data.get("name") as string;
  const gender = data.get("gender") as Gender;
  const instituteId = data.get("instituteId") as string;
  const programId = data.get("programId") as string;
  const sessionId = data.get("sessionId") as string;
  const sectionId = data.get("sectionId") as string;

  // Basic validation
  if (
    !rollNo ||
    !name ||
    !gender ||
    !instituteId ||
    !programId ||
    !sessionId ||
    !sectionId
  ) {
    return {
      success: false,
      message: "All fields are required.",
    };
  }

  try {
    const student = await createStudentWithEnrollment({
      rollNo,
      name,
      gender,
      instituteId,
      programId,
      sessionId,
      sectionId,
    });

    // Revalidate relevant pages
    revalidatePath("/admin/students");
    revalidatePath(`/admin/sections/${sectionId}`);

    return {
      success: true,
      message: "Student created successfully.",
      student,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
};

export const updateStudent = async (id: string, data: FormData) => {
  const name = data.get("name") as string;
  const rollNo = data.get("rollNo") as string;
  const gender = data.get("gender") as Gender;
  const status = data.get("status") as StudentStatus;
  const sessionId = data.get("sessionId") as string;
  const instituteId = data.get("instituteId") as string;
  const programId = data.get("programId") as string;
  const sectionId = data.get("sectionId") as string;

  // Basic validation
  if (
    !name ||
    !rollNo ||
    !gender ||
    !status ||
    !sessionId ||
    !instituteId ||
    !programId ||
    !sectionId
  ) {
    return {
      success: false,
      message: "All fields are required.",
    };
  }

  try {
    const student = await updateStudentWithEnrollment(id, {
      name,
      rollNo,
      gender,
      status,
      sessionId,
      instituteId,
      programId,
      sectionId,
    });

    // Revalidate relevant pages
    revalidatePath("/admin/students");
    revalidatePath(`/admin/sections/${sectionId}`);

    return {
      success: true,
      message: "Student updated successfully.",
      student,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
};

export const importStudentsBulk = async (data: FormData) => {
  const instituteId = data.get("instituteId") as string
  const programId = data.get("programId") as string
  const sessionId = data.get("sessionId") as string
  const sectionId = data.get("sectionId") as string
  const file = data.get("file")

  if (!instituteId || !programId || !sessionId || !sectionId) {
    return {
      success: false,
      message: "Program, session, and section are required",
    }
  }

  if (!(file instanceof File)) {
    return {
      success: false,
      message: "Please upload a CSV or Excel file",
    }
  }

  try {
    const rows = await parseImportFile(file)
    if (rows.length === 0) {
      return {
        success: false,
        message: "No student rows found in file",
      }
    }

    const errors: BulkImportError[] = []
    const seenRollNumbers = new Set<string>()
    let successCount = 0

    for (let index = 0; index < rows.length; index += 1) {
      const rowNumber = index + 2
      const row = rows[index]
      const rollNo = row.rollNo.trim()
      const name = row.name.trim()
      const normalizedGender = normalizeGender(row.gender)

      if (!rollNo || !name || !row.gender.trim()) {
        errors.push({
          row: rowNumber,
          rollNo: rollNo || "(empty)",
          reason: "rollNo, name, and gender are required",
        })
        continue
      }

      const dedupeKey = rollNo.toLowerCase()
      if (seenRollNumbers.has(dedupeKey)) {
        errors.push({
          row: rowNumber,
          rollNo,
          reason: "Duplicate rollNo in uploaded file",
        })
        continue
      }
      seenRollNumbers.add(dedupeKey)

      if (!normalizedGender) {
        errors.push({
          row: rowNumber,
          rollNo,
          reason: "Invalid gender. Use MALE, FEMALE, or OTHER",
        })
        continue
      }

      try {
        await createStudentWithEnrollment({
          rollNo,
          name,
          gender: normalizedGender,
          instituteId,
          programId,
          sessionId,
          sectionId,
        })
        successCount += 1
      } catch (error: unknown) {
        errors.push({
          row: rowNumber,
          rollNo,
          reason: error instanceof Error ? error.message : "Failed to import row",
        })
      }
    }

    revalidatePath("/admin/students")
    revalidatePath(`/admin/sections/${sectionId}`)

    return {
      success: true,
      message: `Import completed. ${successCount} added, ${errors.length} failed.`,
      totalRows: rows.length,
      successCount,
      failedCount: errors.length,
      errors,
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to import students",
    }
  }
}

export const deleteStudent = async (id: string) => {
  try {
    await removeStudent(id);
    revalidatePath("/admin/students");
    return {
      success: true,
      message: "Student deleted successfully.",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong.",
    };
  }
};
