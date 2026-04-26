import { createFileRoute } from "@tanstack/react-router";
import { LandingNavbar } from "../components/landing/LandingNavbar";
import { HeroSection } from "../components/landing/HeroSection";
import { StatsBar } from "../components/landing/StatsBar";
import { HowItWorks } from "../components/landing/HowItWorks";
import { FeaturesGrid } from "../components/landing/FeaturesGrid";
import { ForWhom } from "../components/landing/ForWhom";
import { Testimonials } from "../components/landing/Testimonials";
import { CtaSection } from "../components/landing/CtaSection";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <HeroSection />
      <StatsBar />
      <HowItWorks />
      <FeaturesGrid />
      <ForWhom />
      <Testimonials />
      <CtaSection />
    </>
  );
}
