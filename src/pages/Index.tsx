import Header from "@/components/Header";
import ChapterMarker from "@/components/ChapterMarker";
import HeroSection from "@/components/HeroSection";
import TrustStrip from "@/components/TrustStrip";
import WaterSection from "@/components/WaterSection";
import WhyWhiskySection from "@/components/WhyWhiskySection";
import InvestmentSection from "@/components/InvestmentSection";
import CaseStudySection from "@/components/CaseStudySection";
import GlassSection from "@/components/GlassSection";
import GrainSection from "@/components/GrainSection";
import ProcessSection from "@/components/ProcessSection";
import NewsSection from "@/components/NewsSection";
import FooterSection from "@/components/FooterSection";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const chapters = [
  { id: "heritage", label: "I. Heritage" },
  { id: "opportunity", label: "II. The Opportunity" },
  { id: "why-whisky", label: "III. Why Whisky" },
  { id: "cask", label: "IV. Your Cask" },
  { id: "process", label: "V. The Process" },
  { id: "distilleries", label: "VI. Distilleries" },
];

const Index = () => {
  return (
    <div className="relative">
      <Header />
      <ChapterMarker chapters={chapters} />
      <HeroSection />
      {/* Content sits above the fixed hero and scrolls over it */}
      <div className="relative z-10">
        <TrustStrip />
        <WaterSection />
        <WhyWhiskySection />
        <InvestmentSection />
        <CaseStudySection />
        <GlassSection />
        <ProcessSection />
        <GrainSection />
        <div className="section-light">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="w-full h-px bg-border" />
          </div>
        </div>
        <NewsSection />
        <FooterSection />
      </div>
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
