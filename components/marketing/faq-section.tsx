const faqs = [
  {
    id: 1,
    question: "Can we use this for both semester and annual systems?",
    answer:
      "Yes. Resultify supports multiple program structures and exam workflows.",
  },
  {
    id: 2,
    question: "Is role-based access supported?",
    answer:
      "Yes. Institute Admins and Teachers each get dedicated access and workflows.",
  },
  {
    id: 3,
    question: "Can we publish and share results securely?",
    answer:
      "Yes. Results are managed in controlled flows with publish states and auditable records.",
  },
]

const FaqSection = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">FAQ</p>
          <h3 className="mt-3 text-3xl font-semibold">Common Questions</h3>
        </div>

        <ul className="mt-10 space-y-3">
          {faqs.map((item) => (
            <li key={item.id} className="rounded-2xl border bg-card/90 p-5 shadow-sm">
              <h4 className="text-base font-semibold">{item.question}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FaqSection
