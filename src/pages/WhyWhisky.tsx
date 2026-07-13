import Seo from "@/components/Seo";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";
import PageHero from "@/components/PageHero";
import { useEffect, useRef, useState } from "react";
import scotlandImg from "@/assets/scotland-landscape.jpg";
import tangibleAssetIcon from "@/assets/icons/tangible-asset.png";
import taxFreeIcon from "@/assets/icons/tax-free.png";
import unlinkedMarketsIcon from "@/assets/icons/unlinked-markets.png";
import trackRecordIcon from "@/assets/icons/track-record.png";
import globalDemandIcon from "@/assets/icons/global-demand.png";
import expertManagementIcon from "@/assets/icons/expert-management.png";

const benefits = [
  {
    title: "A Tangible Asset",
    description:
      "Unlike stocks, bonds, or crypto, a whisky cask is a physical asset you can see, touch, and even taste. Your cask is stored in an HMRC government-bonded warehouse in Scotland, fully insured and independently verified.",
    icon: tangibleAssetIcon,
  },
  {
    title: "Tax Free Returns",
    description:
      "Whisky casks are classified as a 'wasting asset' by HMRC, meaning they are entirely exempt from Capital Gains Tax. Unlike most investments, 100% of your returns are yours to keep.",
    icon: taxFreeIcon,
  },
  {
    title: "Unlinked to Financial Markets",
    description:
      "The value of whisky casks is not correlated to stock markets, property, or any financial index. In times of economic uncertainty, whisky has historically proven to be a reliable store of value.",
    icon: unlinkedMarketsIcon,
  },
  {
    title: "Proven Track Record",
    description:
      "Rare whisky has appreciated by 582% over the past decade according to the Knight Frank Luxury Investment Index, making it the best performing collectible asset class of the decade.",
    icon: trackRecordIcon,
  },
  {
    title: "Growing Global Demand",
    description:
      "Global whisky consumption continues to rise, with emerging markets in Asia and the Americas driving unprecedented demand. Supply of aged casks is inherently limited — as whisky ages, some is lost to evaporation (the 'angel's share').",
    icon: globalDemandIcon,
  },
  {
    title: "Expert Portfolio Management",
    description:
      "Our dedicated Portfolio Advisors bring years of industry expertise. From sourcing the right casks to managing your collection and advising on the optimal time to sell, we're with you every step of the way.",
    icon: expertManagementIcon,
  },
];

const WhyWhiskyPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <Seo
        title="Why Whisky | Benefits of Cask Investment"
        description="Tangible, tax-efficient, and globally in demand — explore why Scotch whisky casks have become one of the most resilient alternative investments."
        path="/why-whisky"
      />
      <Header />
      <PageHero image={scotlandImg} imageAlt="Aerial view of Scottish Highland distillery landscape" height="70vh">
        <p className="chapter-marker mb-6 text-secondary-foreground/70 animate-fade-in">
          The Investment Case
        </p>
        <h1 className="display-heading text-4xl md:text-6xl lg:text-7xl text-secondary-foreground animate-fade-in-up">
          Why Whisky
        </h1>
        <p
          className="mt-6 font-body text-sm md:text-base text-secondary-foreground/80 max-w-lg tracking-wide leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          A tangible, tax-free asset with proven returns — unlinked to the
          volatility of financial markets.
        </p>
      </PageHero>

      <div className="relative z-10">
        {/* Intro */}
        <section className="section-light py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <h2 className="display-heading text-3xl md:text-4xl mb-8">
              The world of whisky is one which exudes class, quality, and heritage.
            </h2>
            <p className="font-body text-base leading-relaxed text-muted-foreground max-w-xl mb-6">
              These three things elevate this revered spirit above many of its
              peers, providing a unique opportunity for discerning investors to
              protect and build their wealth.
            </p>
            <p className="font-body text-base leading-relaxed text-muted-foreground max-w-xl">
              Whether you have a passion for whisky and appreciate the unmatched
              taste of an 18-year, single barrel scotch, or you are just looking to
              leverage a reliable long-term hold, whisky cask investment offers
              something truly unique in the modern investment landscape.
            </p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="section-light pb-32">
          <div ref={ref} className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
              {benefits.map((benefit, i) => (
                <div
                  key={benefit.title}
                  className={`transition-all duration-1000 ${
                    visible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${200 + i * 100}ms` }}
                >
                  <img src={benefit.icon} alt={benefit.title} className="w-20 h-20 mb-6 object-contain" />
                  <div className="w-12 h-px bg-primary mb-6" />
                  <h3 className="font-display text-xl font-light mb-4">
                    {benefit.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats banner */}
        <section className="section-dark py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <p className="font-display text-5xl md:text-6xl text-primary font-light mb-3">
                  582%
                </p>
                <p className="font-body text-sm text-secondary-foreground">
                  Rare whisky appreciation over 10 years
                </p>
              </div>
              <div>
                <p className="font-display text-5xl md:text-6xl text-primary font-light mb-3">
                  0%
                </p>
                <p className="font-body text-sm text-secondary-foreground">
                  Capital Gains Tax on whisky casks
                </p>
              </div>
              <div>
                <p className="font-display text-5xl md:text-6xl text-primary font-light mb-3">
                  #1
                </p>
                <p className="font-body text-sm text-secondary-foreground">
                  Best performing collectible of the decade
                </p>
              </div>
            </div>
            <p className="text-center mt-12 font-body text-xs uppercase tracking-[0.15em] text-secondary-foreground">
              Source: Knight Frank Luxury Investment Index
            </p>
          </div>
        </section>

        {/* Light CTA */}
        <section className="section-light py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
            <h2 className="display-heading text-3xl md:text-5xl mb-8">
              Ready to invest?
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
              Download our free brochure or speak with one of our expert Portfolio
              Advisors to start building your whisky cask collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
              <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-foreground border border-border px-8 py-3.5 hover:bg-muted transition-all duration-500">
                Speak to an Advisor
              </ContactButton>
            </div>
          </div>
        </section>

        <FooterSection hideCta />
      </div>
    </div>
  );
};

export default WhyWhiskyPage;
