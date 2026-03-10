import { useEffect, useRef, useState } from "react";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";

const steps = [
  {
    number: "01",
    title: "Download Our Brochure",
    description: "Compare the investment opportunities available to you with our comprehensive free brochure.",
  },
  {
    number: "02",
    title: "Speak to an Advisor",
    description: "Reach out to one of our expert Portfolio Advisors to discuss your requirements and identify your personal investment goals.",
  },
  {
    number: "03",
    title: "Secure Your Cask",
    description: "With the help of your Advisor, complete the necessary documentation and payments to authenticate your whisky cask investment.",
  },
  {
    number: "04",
    title: "Certificates of Ownership",
    description: "Receive your official certificates of ownership. Your casks are stored at HMRC government-bonded warehouses, covered by insurance and free from taxation.",
  },
  {
    number: "05",
    title: "Expert Ongoing Management",
    description: "Your expert Advisor will share regular updates on the whisky market and how this impacts your current investment.",
  },
  {
    number: "06",
    title: "Sell or Bottle",
    description: "When the time is right, sell your cask for a return or bottle it to share with friends and family as a unique, memorable gift.",
  },
];

const ProcessSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" className="section-light">
      <div className="py-16 md:py-24" />
      <div ref={ref} className="max-w-2xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">How It Works</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-16 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          A solid, dependable strategy — guided every step of the way.
        </h2>

        {/* Single-column timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border" />

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`relative pl-16 transition-all duration-1000 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + i * 150}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-[16px] top-1 w-[15px] h-[15px] rounded-full border-2 border-primary bg-background" />
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
                  Step {step.number}
                </p>
                <h3 className="font-display text-xl font-light mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-16 flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
          <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-foreground border border-border px-8 py-3.5 hover:bg-muted transition-all duration-500">
            Speak to an Advisor
          </ContactButton>
        </div>
      </div>
      <div className="py-16" />
    </section>
  );
};

export default ProcessSection;
