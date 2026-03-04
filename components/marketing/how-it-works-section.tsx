const steps = [
  {
    id: 1,
    title: "Register Your Institute",
    description: "Set up your institute profile and assign the admin account.",
  },
  {
    id: 2,
    title: "Configure Academic Structure",
    description: "Add departments, programs, sessions, terms, courses, and sections.",
  },
  {
    id: 3,
    title: "Enter Marks & Publish Results",
    description: "Teachers submit marks and admins publish official result cards.",
  },
]

const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            How It Works
          </p>
          <h3 className="mt-3 text-3xl font-semibold">Go Live In Three Steps</h3>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.id} className="rounded-2xl border bg-card/90 p-6 shadow-sm">
              <p className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
                {step.id}
              </p>
              <h4 className="mt-4 text-lg font-semibold">{step.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default HowItWorksSection
