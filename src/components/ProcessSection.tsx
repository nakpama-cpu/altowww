import { useEffect, useRef, useState } from "react";

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
    title: "Sit Back & Relax",
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
      <div className="py-32 md:py-48" />
      <div ref={ref} className="max-w-4xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">How It Works</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-20 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          A solid, dependable strategy — guided every step of the way.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
            >
              <p className="font-display text-5xl text-primary/20 font-light mb-4">
                {step.number}
              </p>
              <h3 className="font-display text-xl font-light mb-3">
                {step.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="py-24" />
    </section>
  );
};

export default ProcessSection;
