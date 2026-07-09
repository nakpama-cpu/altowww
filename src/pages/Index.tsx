import Seo from "@/components/Seo";
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
import StickyMobileCTA from "@/components/StickyMobileCTA";


const chapters = [
  { id: "heritage", label: "I. Alto Whisky" },
  { id: "opportunity", label: "II. The Opportunity" },
  { id: "why-whisky", label: "III. Why Whisky" },
  { id: "investment", label: "IV. The Investment" },
  { id: "cask", label: "V. Your Cask" },
  { id: "process", label: "VI. The Process" },
  { id: "distilleries", label: "VII. Distilleries" },
  { id: "news", label: "VIII. News & Insights" },
];

const Index = () => {
  return (
    <div className="relative">

        <Seo
          title="Alto Whisky | Premium Whisky Cask Investment"
          description="Invest in Scottish single malt whisky casks with Alto Whisky. Expert advisory, HMRC-bonded storage, and tax-efficient returns for discerning investors."
          path="/"
        />
        <Header />
        <ChapterMarker chapters={chapters} />
        <HeroSection />
        {/* Content sits above the fixed hero and scrolls over it */}
        <div className="relative z-10">
          <WaterSection />
          <WhyWhiskySection />
          <InvestmentSection />
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
