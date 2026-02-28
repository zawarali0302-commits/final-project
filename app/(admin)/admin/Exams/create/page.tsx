import { getUserByClerkId } from "@/prisma/user.service"
import { getSectionsByInstitute } from "@/prisma/section.service"
import { getCourseOfferingsByInstitute } from "@/prisma/courseOffering.service"
import CreateExamForm from "@/components/forms/create-exam--form"

const CreateExamPage = async () => {
  const user = await getUserByClerkId()

  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
    return <div>Unauthorized</div>
  }

  const sections = await getSectionsByInstitute(user.instituteId!)
  const courseOfferings = await getCourseOfferingsByInstitute(user.instituteId!)

  return (
    <CreateExamForm
      sections={sections}
      courseOfferings={courseOfferings}
    />
  )
}

export default CreateExamPage