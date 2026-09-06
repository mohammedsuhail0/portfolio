import { HeroSection } from "@/components/HeroSection";
import { SkillsMarquee } from "@/components/SkillsMarquee";
import { TimelineSection } from "@/components/TimelineSection";
import { WorkingStyleSection } from "@/components/WorkingStyleSection";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroSection />
      <SkillsMarquee />
      <TimelineSection />
      <WorkingStyleSection />
      <ContactSection />
    </div>
  );
}

