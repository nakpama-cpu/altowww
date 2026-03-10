import Header from "@/components/Header";
import ChapterMarker from "@/components/ChapterMarker";
import HeroSection from "@/components/HeroSection";
import WaterSection from "@/components/WaterSection";
import WhyWhiskySection from "@/components/WhyWhiskySection";
import InvestmentSection from "@/components/InvestmentSection";
import GrainSection from "@/components/GrainSection";
import ProcessSection from "@/components/ProcessSection";
import GlassSection from "@/components/GlassSection";
import NewsSection from "@/components/NewsSection";
import FooterSection from "@/components/FooterSection";

const chapters = [
  { id: "heritage", label: "I. Heritage" },
  { id: "opportunity", label: "II. The Opportunity" },
  { id: "why-whisky", label: "III. Why Whisky" },
  { id: "distilleries", label: "IV. Distilleries" },
  { id: "process", label: "V. The Process" },
  { id: "cask", label: "VI. Your Cask" },
];

const Index = () => {
  return (
    <div className="relative">
      <Header />
      <ChapterMarker chapters={chapters} />
      <HeroSection />
      <WaterSection />
      <WhyWhiskySection />
      <InvestmentSection />
      <GrainSection />
      <ProcessSection />
      <GlassSection />
      <NewsSection />
      <FooterSection />
    </div>
  );
};

export default Index;
