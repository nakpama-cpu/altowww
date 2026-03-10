import { useEffect, useRef, useState } from "react";
import BrochureButton from "@/components/BrochureButton";

const stats = [
  { value: "582%", label: "Rare whisky appreciation over 10 years" },
  { value: "£4.2B", label: "Global whisky market value" },
  { value: "#1", label: "Top performing collectible of the decade" },
];

const InvestmentSection = () => {
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
    <section className="section-light">
      <div className="py-16 md:py-24" />
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">The Investment</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-12 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Top Performing Assets
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 200}ms` }}
            >
              <p className="font-display text-4xl md:text-5xl text-primary font-light mb-3">
                {stat.value}
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <p
          className={`mt-12 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground/60 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          Source: Knight Frank Luxury Investment Index
        </p>

        <div
          className={`mt-10 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
        </div>
      </div>
      <div className="py-16" />
    </section>
  );
};

export default InvestmentSection;
