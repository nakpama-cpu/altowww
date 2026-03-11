import { useEffect, useRef, useState } from "react";
import BrochureButton from "@/components/BrochureButton";

const caskExamples = [
  {
    distillery: "Macallan",
    region: "Speyside",
    year: "2015",
    purchasePrice: "£8,500",
    currentValue: "£19,200",
    appreciation: "126%",
    age: "10 years",
  },
  {
    distillery: "Ardbeg",
    region: "Islay",
    year: "2017",
    purchasePrice: "£5,200",
    currentValue: "£14,800",
    appreciation: "185%",
    age: "8 years",
  },
  {
    distillery: "Highland Park",
    region: "Islands",
    year: "2018",
    purchasePrice: "£6,000",
    currentValue: "£13,500",
    appreciation: "125%",
    age: "7 years",
  },
];

const CaseStudySection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-light">
      <div className="py-10 md:py-16" />
      <div ref={ref} className="max-w-5xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">Example Returns</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-6 max-w-3xl transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Real cask performance, real results.
        </h2>
        <p
          className={`font-body text-base text-muted-foreground max-w-2xl mb-14 transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Below are illustrative examples of cask investments sourced through Alto Whisky, 
          demonstrating the potential for significant appreciation over time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {caskExamples.map((cask, i) => (
            <div
              key={cask.distillery}
              className={`border border-border p-8 transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${400 + i * 150}ms` }}
            >
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-1">
                {cask.region}
              </p>
              <h3 className="font-display text-2xl font-light text-foreground mb-1">
                {cask.distillery}
              </h3>
              <p className="font-body text-xs text-muted-foreground mb-6">
                Cask acquired {cask.year} · {cask.age} maturation
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">
                    Purchase Price
                  </span>
                  <span className="font-display text-lg text-foreground">
                    {cask.purchasePrice}
                  </span>
                </div>
                <div className="w-full h-px bg-border" />
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-xs uppercase tracking-wider text-muted-foreground">
                    Current Value
                  </span>
                  <span className="font-display text-lg text-foreground">
                    {cask.currentValue}
                  </span>
                </div>
                <div className="w-full h-px bg-border" />
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-xs uppercase tracking-wider text-primary">
                    Appreciation
                  </span>
                  <span className="font-display text-2xl text-primary font-light">
                    +{cask.appreciation}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p
          className={`mt-8 font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          *Illustrative examples. Past performance does not guarantee future returns.
        </p>

        <div
          className={`mt-10 flex justify-center transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
        </div>
      </div>
      <div className="py-10" />
    </section>
  );
};

export default CaseStudySection;
