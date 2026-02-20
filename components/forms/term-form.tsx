import { createTerm, updateTerm } from "@/app/actions/term.actions"
import { getAcademicYears } from "@/prisma/academicYear.service"

interface TermFormProps {
  programId: string
  initialData?: {
    id: string
    name: string
    programId: string
    academicYearId: string
  }
}

export default async function TermForm({
  programId,
  initialData,
}: TermFormProps) {
  const academicYears = await getAcademicYears()
  const action = initialData ? updateTerm.bind(null, initialData.id) : createTerm

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">
        {initialData ? "Edit Term" : "Add Term"}
      </h1>

      <form action={action} className="space-y-4">
        {/* Hidden IDs */}
        <input type="hidden" name="programId" value={programId} />
        {initialData && (
          <input type="hidden" name="id" value={initialData?.id} />
        )}

        {/* Academic Year */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Academic Year</label>
          <select
            name="academicYearId"
            required
            defaultValue={initialData?.academicYearId ?? ""}
            className="w-full border rounded-md p-2"
          >
            <option value="" disabled>
              Select academic year
            </option>
            {academicYears.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>
        </div>

        {/* Term Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Term Name</label>
          <input
            type="text"
            name="name"
            required
            defaultValue={initialData?.name}
            placeholder="Semester 1 / Part 1"
            className="w-full border rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white rounded-md p-2 hover:opacity-90 transition"
        >
          {initialData? "Update Term" : "Create Term"}
        </button>
      </form>
    </div>
  )
}
