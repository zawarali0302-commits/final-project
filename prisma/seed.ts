import { AttendanceStatus, ExamType, Gender, InstituteType, PrismaClient, ProgramLevel, ProgramSystem, StudentStatus, UserRole } from "@/app/generated/prisma/client"

import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});



async function main() {
  // --- Institutes ---
  const institute1 = await prisma.institute.create({
    data: {
      name: "Global University",
      type: "UNIVERSITY",
      location: "New York, USA",
    },
  })

  // --- Users ---
  const superAdmin = await prisma.user.create({
    data: {
      email: "superadmin@globaluni.edu",
      password: "password123",
      role: "SUPER_ADMIN",
      instituteId: institute1.id,
      isEmailVerified: true,
    },
  })

  const teacherUser = await prisma.user.create({
    data: {
      email: "john.doe@globaluni.edu",
      password: "password123",
      role: "TEACHER",
      instituteId: institute1.id,
      isEmailVerified: true,
    },
  })

  const studentUser = await prisma.user.create({
    data: {
      email: "alice.smith@globaluni.edu",
      password: "password123",
      role: "STUDENT",
      instituteId: institute1.id,
      isEmailVerified: true,
    },
  })

  // --- Departments ---
  const mathDept = await prisma.department.create({
    data: {
      name: "Mathematics",
      code: "MATH",
      instituteId: institute1.id,
    },
  })

  const csDept = await prisma.department.create({
    data: {
      name: "Computer Science",
      code: "CS",
      instituteId: institute1.id,
    },
  })

  // --- Programs ---
  const bsMath = await prisma.program.create({
    data: {
      name: "BS Mathematics",
      level: "UNDERGRADUATE",
      system: "SEMESTER",
      departmentId: mathDept.id,
    },
  })

  const bsCS = await prisma.program.create({
    data: {
      name: "BS Computer Science",
      level: "UNDERGRADUATE",
      system: "SEMESTER",
      departmentId: csDept.id,
    },
  })

  // --- Sessions / Batches ---
  const session2024 = await prisma.session.create({
    data: {
      name: "Batch 2024-2028",
      startYear: 2024,
      endYear: 2028,
      programId: bsMath.id,
      instituteId: institute1.id,
    },
  })

  const session2024CS = await prisma.session.create({
    data: {
      name: "Batch 2024-2028",
      startYear: 2024,
      endYear: 2028,
      programId: bsCS.id,
      instituteId: institute1.id,
    },
  })

  // --- Academic Years ---
  const academicYear2025 = await prisma.academicYear.create({
    data: {
      name: "2025-2026",
      startDate: new Date("2025-08-01"),
      endDate: new Date("2026-05-31"),
      isActive: true,
      instituteId: institute1.id,
    },
  })

  // --- Terms ---
  const term1Math = await prisma.term.create({
    data: {
      name: "Semester 1",
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-12-15"),
      programId: bsMath.id,
      academicYearId: academicYear2025.id,
    },
  })

  const term1CS = await prisma.term.create({
    data: {
      name: "Semester 1",
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-12-15"),
      programId: bsCS.id,
      academicYearId: academicYear2025.id,
    },
  })

  // --- Sections ---
  const sectionA = await prisma.section.create({
    data: {
      name: "A",
      termId: term1Math.id,
    },
  })

  const sectionB = await prisma.section.create({
    data: {
      name: "B",
      termId: term1CS.id,
    },
  })

  // --- Courses ---
  const calculus = await prisma.course.create({
    data: {
      name: "Calculus I",
      code: "MATH101",
      credits: 3,
      departmentId: mathDept.id,
    },
  })

  const programming = await prisma.course.create({
    data: {
      name: "Introduction to Programming",
      code: "CS101",
      credits: 3,
      departmentId: csDept.id,
    },
  })

  // --- Teachers ---
  const teacher1 = await prisma.teacher.create({
    data: {
      name: "John Doe",
      designation: "Assistant Professor",
      email: "john.doe@globaluni.edu",
      instituteId: institute1.id,
      departmentId: mathDept.id,
      userId: teacherUser.id,
    },
  })

  // --- Students ---
  const student1 = await prisma.student.create({
    data: {
      rollNo: "MATH001",
      name: "Alice Smith",
      gender: "FEMALE",
      instituteId: institute1.id,
      programId: bsMath.id,
      userId: studentUser.id,
      batchId: session2024.id,
    },
  })

  // --- Course Offerings ---
  const calcOffering = await prisma.courseOffering.create({
    data: {
      courseId: calculus.id,
      termId: term1Math.id,
      sectionId: sectionA.id,
      teacherId: teacher1.id,
    },
  })

  // --- Student Enrollments ---
  const enrollment1 = await prisma.studentEnrollment.create({
    data: {
      studentId: student1.id,
      courseOfferingId: calcOffering.id,
    },
  })

  // --- Attendance ---
  await prisma.attendance.createMany({
    data: [
      { enrollmentId: enrollment1.id, date: new Date("2025-08-05"), status: "PRESENT" },
      { enrollmentId: enrollment1.id, date: new Date("2025-08-06"), status: "ABSENT" },
    ],
  })

  // --- Exams ---
  const midExam = await prisma.exam.create({
    data: {
      type: "MID",
      title: "Midterm Exam",
      date: new Date("2025-10-15"),
      totalMarks: 100,
      sectionId: sectionA.id,
      courseOfferingId: calcOffering.id,
    },
  })

  // --- Results ---
  await prisma.result.create({
    data: {
      marks: 85,
      grade: "A",
      remarks: "Good performance",
      enrollmentId: enrollment1.id,
      examId: midExam.id,
    },
  })

  console.log("✅ Seed data created successfully!")
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
