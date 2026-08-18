import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturedTracksLoader } from "@/components/landing/featured-tracks-loader";
import { FeaturesSection } from "@/components/landing/features-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedTracksLoader />
      <FeaturesSection />
      <CtaSection />
    </MainLayout>
  );
}
