import ChapterMarker from "@/components/ChapterMarker";
import BuyButton from "@/components/BuyButton";
import HeroSection from "@/components/HeroSection";
import WaterSection from "@/components/WaterSection";
import GrainSection from "@/components/GrainSection";
import InvestmentSection from "@/components/InvestmentSection";
import GlassSection from "@/components/GlassSection";
import FooterSection from "@/components/FooterSection";

const chapters = [
  { id: "mountain", label: "I. The Mountain" },
  { id: "water", label: "II. The Water" },
  { id: "grain", label: "III. The Grain" },
  { id: "glass", label: "IV. The Glass" },
];

const Index = () => {
  return (
    <div className="relative">
      <ChapterMarker chapters={chapters} />
      <BuyButton />
      <HeroSection />
      <WaterSection />
      <GrainSection />
      <InvestmentSection />
      <GlassSection />
      <FooterSection />
    </div>
  );
};

export default Index;
