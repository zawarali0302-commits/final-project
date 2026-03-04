import FeaturesSection from "@/components/marketing/features-section"
import FaqSection from "@/components/marketing/faq-section"
import FinalCtaSection from "@/components/marketing/final-cta-section"
import HeroSection from "@/components/marketing/hero-section"
import HowItWorksSection from "@/components/marketing/how-it-works-section"
import RoleBenefitsSection from "@/components/marketing/role-benefits-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <RoleBenefitsSection />
      <HowItWorksSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  )
}
