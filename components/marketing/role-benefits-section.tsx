import { BookOpenCheck, Building2, UserCog } from "lucide-react"

const roles = [
  {
    id: 1,
    title: "Institute Admin",
    description:
      "Manage departments, programs, sessions, exams, and publish results from one dashboard.",
    icon: UserCog,
    points: ["Centralized control", "Faster operations", "Result publishing"],
  },
  {
    id: 2,
    title: "Teacher",
    description:
      "Enter marks course-wise, monitor sections, and submit results with fewer errors.",
    icon: BookOpenCheck,
    points: ["Simple marking flow", "Section-level tracking", "Exam-wise updates"],
  },
  {
    id: 3,
    title: "Institution",
    description:
      "Standardize academic reporting and deliver professional result cards at scale.",
    icon: Building2,
    points: ["Consistent records", "Improved transparency", "Scalable process"],
  },
]

const RoleBenefitsSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Built For Real Workflows
          </p>
          <h3 className="mt-3 text-3xl font-semibold">Right Tools For Every Stakeholder</h3>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <li
                key={role.id}
                className="rounded-2xl border bg-card/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="inline-flex rounded-xl border bg-muted/70 p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="mt-4 text-lg font-semibold">{role.title}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {role.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default RoleBenefitsSection
