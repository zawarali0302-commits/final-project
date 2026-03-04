import Footer from "@/components/marketing/footer"
import Header from "@/components/marketing/header"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_hsl(var(--background))_60%)]">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
