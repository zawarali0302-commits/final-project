import RegisterInstituteForm from "@/components/forms/register-institute"

export default function RegisterInstitutePage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6">Register Your Institute</h1>
      {/* Pass the server action as a prop */}
      <RegisterInstituteForm />
    </div>
  )
}