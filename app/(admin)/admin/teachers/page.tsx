import TeachersTable from "@/components/teachers-table"
import { AddTeacherDialog } from "@/components/forms/add-teacher-dialog"
import { getDepartmentsByInstitute } from "@/prisma/department.service"
import { getTeachersByInstituteId } from "@/prisma/teacher.service"
import { getUserByClerkId } from "@/prisma/user.service"

const TeachersPage = async () => {
   const dbUser = await getUserByClerkId()
   
     if (!dbUser?.instituteId) {
       return <div>No institute found</div>
     }
  
      const teachers = await getTeachersByInstituteId(
          dbUser.instituteId
      )
      const departments = await getDepartmentsByInstitute(dbUser.instituteId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">
            Manage institute teaching staff
          </p>
        </div>

        <AddTeacherDialog instituteId={dbUser.instituteId} departments={departments} />
      </div>

      <TeachersTable teachers={teachers} />
    </div>
  )
}

export default TeachersPage
