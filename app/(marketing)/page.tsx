import { EmptyState } from "@/components/empty-state";
import FeaturesSection from "@/components/marketing/features-section";
import HeroSection from "@/components/marketing/hero-section";
import { SkeletonText } from "@/components/skeleton-text";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* <SkeletonText />
          <EmptyState title="ResultCard" description="Manage results for multiple schools and colleges securely from one platform." button="Get Started" href="/login" icon={<Building2 />} /> */}

      <HeroSection />
      <FeaturesSection />
    </>
  );
}
