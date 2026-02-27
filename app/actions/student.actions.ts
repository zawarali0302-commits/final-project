"use server";

import { revalidatePath } from "next/cache";
import { Gender, StudentStatus } from "../generated/prisma/enums";
import { createStudentWithEnrollment, removeStudent, updateStudentWithEnrollment } from "@/prisma/student.service";

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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong.",
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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  }
};


export const deleteStudent = async (id: string) => {
  try {
    await removeStudent(id);
    revalidatePath("/admin/students");
    return {
      success: true,
      message: "Student deleted successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong.",
    };
  }
};
