import { HeroSection } from "@/components/HeroSection";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { TimelineSection } from "@/components/TimelineSection";
import { WorkingStyleSection } from "@/components/WorkingStyleSection";
import { ContactSection } from "@/components/ContactSection";
import { MobilePortfolioView } from "@/components/mobile/MobilePortfolioView";

export default function Home() {
  return (
    <>
      {/* 1. DEDICATED DESKTOP EXPERIENCE (Screens md and above) */}
      <div className="hidden md:flex flex-col w-full min-h-screen">
        <HeroSection />
        <SkillsMarquee />
        <TimelineSection />
        <WorkingStyleSection />
        <ContactSection />
      </div>

      {/* 2. DEDICATED MOBILE WEB APP EXPERIENCE (Screens below md) */}
      <div className="block md:hidden w-full">
        <MobilePortfolioView />
      </div>
    </>
  );
}

