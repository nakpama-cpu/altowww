import Header from "@/components/Header";
import ChapterMarker from "@/components/ChapterMarker";
import HeroSection from "@/components/HeroSection";
import WaterSection from "@/components/WaterSection";
import WhyWhiskySection from "@/components/WhyWhiskySection";
import InvestmentSection from "@/components/InvestmentSection";
import GrainSection from "@/components/GrainSection";
import ProcessSection from "@/components/ProcessSection";
import NewsSection from "@/components/NewsSection";
import FooterSection from "@/components/FooterSection";

const chapters = [
  { id: "heritage", label: "I. Heritage" },
  { id: "opportunity", label: "II. The Opportunity" },
  { id: "why-whisky", label: "III. Why Whisky" },
  { id: "distilleries", label: "IV. Distilleries" },
  { id: "process", label: "V. The Process" },
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
        <GrainSection />
        <ProcessSection />
        <NewsSection />
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
