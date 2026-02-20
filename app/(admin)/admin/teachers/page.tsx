import { Button } from "@/components/ui/button"
import Link from "next/link"
import TeachersTable from "@/components/teachers-table"
import { getTeachers } from "@/prisma/teacher.service"

const TeachersPage = async () => {
  const teachers = await getTeachers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-muted-foreground">
            Manage institute teaching staff
          </p>
        </div>

        <Link href="/admin/teachers/create">
          <Button>Add Teacher</Button>
        </Link>
      </div>

      <TeachersTable teachers={teachers} />
    </div>
  )
}

export default TeachersPage
