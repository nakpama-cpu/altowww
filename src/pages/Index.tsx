import Header from "@/components/Header";
import ChapterMarker from "@/components/ChapterMarker";
import HeroSection from "@/components/HeroSection";
import WaterSection from "@/components/WaterSection";
import WhyWhiskySection from "@/components/WhyWhiskySection";
import InvestmentSection from "@/components/InvestmentSection";
import GlassSection from "@/components/GlassSection";
import GrainSection from "@/components/GrainSection";
import ProcessSection from "@/components/ProcessSection";
import NewsSection from "@/components/NewsSection";
import FooterSection from "@/components/FooterSection";

const chapters = [
  { id: "heritage", label: "I. Heritage" },
  { id: "opportunity", label: "II. The Opportunity" },
  { id: "why-whisky", label: "III. Why Whisky" },
  { id: "cask", label: "IV. Your Cask" },
  { id: "distilleries", label: "V. Distilleries" },
  { id: "process", label: "VI. The Process" },
];

const Index = () => {
  return (
    <div className="relative">
      <Header />
      <ChapterMarker chapters={chapters} />
      <HeroSection />
      {/* Content sits above the fixed hero and scrolls over it */}
      <div className="relative z-10">
        <WaterSection />
        <WhyWhiskySection />
        <InvestmentSection />
        <GlassSection />
        <GrainSection />
        <ProcessSection />
        <div className="section-light">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="w-full h-px bg-border" />
          </div>
        </div>
        <NewsSection />
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
