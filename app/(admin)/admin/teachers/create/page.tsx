import prisma from "@/lib/prisma"
import TeacherForm from "@/components/forms/teacher-form"

import { getDepartments } from "@/prisma/department.service"

export default async function CreateTeacherPage() {
  // ⚠️ Replace this with session-based instituteId later
  const institute = await prisma.institute.findFirst()

  if (!institute) {
    return <div>No institute found.</div>
  }

  const departments = await getDepartments()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Teacher</h1>
        <p className="text-muted-foreground">
          Add a new teacher to the institute
        </p>
      </div>

      <TeacherForm
        departments={departments}
        instituteId={institute.id}
      />
    </div>
  )
}

// const page = async () => {
//   const institute = await prisma.institute.findFirst()
//   const departments = await getDepartments()

//   return (
//     <div>
//       instituteId: {institute?.id}
//       department: {departments.map((d) => d.name).join(", ")}
//     </div>
//   )
// }

// export default page
