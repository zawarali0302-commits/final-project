import { DepartmentForm } from "@/components/forms/department-form"
interface CreateDepartmentPageProps {
  searchParams: Promise<{
    instituteId: string
  }>
}
export default async function CreateDepartmentPage({ searchParams }: CreateDepartmentPageProps) {
  const {instituteId} = await searchParams
  
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">{instituteId}</h1>
      <DepartmentForm instituteId={instituteId}/>
    </div>
  )
}
