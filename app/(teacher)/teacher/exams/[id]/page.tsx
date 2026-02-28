// "use client"

// import prisma from "@/lib/prisma"
// import { currentUser } from "@clerk/nextjs/server"
// import { redirect, notFound } from "next/navigation"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { useServerAction } from "@/hook/useServerAction"
// import { createOrUpdateResults } from "@/app/actions/result.actions" // make this action to save marks

// interface EnterMarksPageProps {
//   params: {
//     examId: string
//   }
// }

// const EnterMarksPage = async ({ params }: EnterMarksPageProps) => {
//   const { examId } = params
//   const clerkUser = await currentUser()
//   if (!clerkUser?.id) redirect("/sign-in")

//   const user = await prisma.user.findUnique({
//     where: { email: clerkUser.emailAddresses[0].emailAddress },
//     include: { teacher: true },
//   })

//   if (!user || user.role !== "TEACHER" || !user.teacher) redirect("/")

//   const teacherId = user.teacher.id

//   // Fetch exam + section + students + existing results
//   const exam = await prisma.exam.findUnique({
//     where: { id: examId },
//     include: {
//       section: {
//         include: {
//           studentEnrollments: { include: { student: true } },
//           sectionCourses: true, // check assigned teacher
//         },
//       },
//       courseOffering: { include: { course: true } },
//       results: { include: { enrollment: { include: { student: true } } } },
//     },
//   })

//   if (!exam) notFound()

//   // Ensure teacher is assigned to this section
//   const isTeacherAssigned = exam.section.sectionCourses.some(
//     (sc) => sc.teacherId === teacherId
//   )
//   if (!isTeacherAssigned) redirect("/")

//   // Prepare student rows
//   const students = exam.section.studentEnrollments.map((enrollment) => {
//     const existingResult = exam.results.find(
//       (r) => r.enrollmentId === enrollment.id
//     )
//     return {
//       enrollmentId: enrollment.id,
//       student: enrollment.student,
//       marks: existingResult?.marks || "",
//       remarks: existingResult?.remarks || "",
//     }
//   })

//   const { execute, isPending } = useServerAction(createOrUpdateResults)

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold">
//         Enter Marks - {exam.courseOffering.course.name} ({exam.section.name})
//       </h1>
//       <p className="text-muted-foreground">
//         Exam: {exam.title} | Type: {exam.type} | Total Marks: {exam.totalMarks}
//       </p>

//       <form action={execute} className="space-y-4">
//         <table className="w-full table-auto border-collapse border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-2 py-1">Roll No</th>
//               <th className="border px-2 py-1">Name</th>
//               <th className="border px-2 py-1">Marks</th>
//               <th className="border px-2 py-1">Remarks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.map(({ enrollmentId, student, marks, remarks }) => (
//               <tr key={enrollmentId}>
//                 <td className="border px-2 py-1">{student.rollNo}</td>
//                 <td className="border px-2 py-1">{student.name}</td>
//                 <td className="border px-2 py-1">
//                   <Input
//                     type="number"
//                     name={`marks[${enrollmentId}]`}
//                     defaultValue={marks}
//                     max={exam.totalMarks}
//                     min={0}
//                     required
//                   />
//                 </td>
//                 <td className="border px-2 py-1">
//                   <Input
//                     name={`remarks[${enrollmentId}]`}
//                     defaultValue={remarks}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <Button type="submit" className="w-full mt-4">
//           {isPending ? "Saving..." : "Save Marks"}
//         </Button>
//       </form>
//     </div>
//   )
// }

// export default EnterMarksPage

import React from 'react'

const page = () => {
  return (
    <div>
      123
    </div>
  )
}

export default page
