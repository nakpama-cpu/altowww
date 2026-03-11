import { useEffect, useRef, useState } from "react";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";

const benefits = [
  {
    title: "Capital Appreciation",
    description: "Whisky increases in value as it matures, with rare whisky appreciating 582% over the past decade. Uncorrelated to stock markets or financial indices, it acts as a powerful hedge in volatile times.",
  },
  {
    title: "Tangible Asset",
    description: "Unlike stocks or crypto, you own a physical cask of whisky stored in an HMRC government-bonded warehouse in Scotland, fully insured and independently verified.",
  },
  {
    title: "Tax Free",
    description: "Whisky casks are classified as a 'wasting asset' by HMRC, meaning they are exempt from Capital Gains Tax — 100% of your returns are yours to keep.",
  },
];

const WhyWhiskySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-whisky" className="section-dark relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--primary)) 0%, transparent 40%)`,
      }} />
      <div className="relative z-10">
      <div className="py-10 md:py-16" />
      <div ref={ref} className="max-w-4xl mx-auto px-6 md:px-12">
        <p
          className={`chapter-marker mb-8 text-secondary-foreground/50 transition-all duration-1000 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          Why Whisky
        </p>
        <h2
          className={`display-heading text-3xl md:text-5xl text-secondary-foreground mb-14 transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Three reasons investors choose whisky casks over traditional assets.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              className={`transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${400 + i * 200}ms` }}
            >
              <div className="w-12 h-px bg-primary mb-6" />
              <h3 className="font-display text-xl md:text-2xl text-secondary-foreground font-light mb-4">
                {benefit.title}
              </h3>
              <p className="font-body text-sm text-secondary-foreground/70 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
          <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-secondary-foreground border border-secondary-foreground/30 px-8 py-3.5 hover:bg-secondary-foreground/10 transition-all duration-500">
            Speak to an Advisor
          </ContactButton>
        </div>
      </div>
      <div className="py-10" />
      </div>
    </section>
  );
};

export default WhyWhiskySection;
