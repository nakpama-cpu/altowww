import { useEffect, useRef, useState } from "react";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";
import stepBrochure from "@/assets/icons/step-brochure.png";
import stepAdvisor from "@/assets/icons/step-advisor.png";
import stepCask from "@/assets/icons/step-cask.png";
import stepCertificate from "@/assets/icons/step-certificate.png";
import stepManagement from "@/assets/icons/step-management.png";
import stepExit from "@/assets/icons/step-exit.png";

const steps = [
  {
    number: "01",
    title: "Download Our Brochure",
    description: "Compare the investment opportunities available to you with our comprehensive free brochure.",
    icon: stepBrochure,
  },
  {
    number: "02",
    title: "Speak to an Advisor",
    description: "Reach out to one of our expert Portfolio Advisors to discuss your requirements.",
    icon: stepAdvisor,
  },
  {
    number: "03",
    title: "Secure Your Cask",
    description: "Complete the necessary documentation and payments to authenticate your whisky cask investment.",
    icon: stepCask,
  },
  {
    number: "04",
    title: "Certificates of Ownership",
    description: "Receive your official certificates. Your casks are stored at HMRC bonded warehouses, insured and tax-free.",
    icon: stepCertificate,
  },
  {
    number: "05",
    title: "Expert Ongoing Management",
    description: "Your expert Advisor will share regular updates on the whisky market and your investment.",
    icon: stepManagement,
  },
  {
    number: "06",
    title: "Sell or Bottle",
    description: "When the time is right, sell your cask for a return or bottle it as a unique, memorable gift.",
    icon: stepExit,
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
    <section id="process" className="section-light flex flex-col min-h-[calc(100vh-5rem)]">
      <div id="process-start" className="pt-10 md:pt-14 pb-4 md:pb-6" />
      <div ref={ref} className="max-w-5xl mx-auto px-6 md:px-12 flex-1 flex flex-col justify-center">
        <p className="chapter-marker mb-3 md:mb-4">How It Works</p>
        <h2
          className={`display-heading text-3xl md:text-4xl mb-4 md:mb-6 max-w-2xl transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          A solid, dependable strategy — guided every step of the way.
        </h2>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`text-center transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <img
                src={step.icon}
                alt={step.title}
                className="w-14 h-14 mx-auto mb-3 object-contain"
              />
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-1">
                Step {step.number}
              </p>
              <h3 className="font-display text-lg font-light mb-1.5">
                {step.title}
              </h3>
              <p className="font-body text-sm text-muted-foreground leading-snug">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-4 md:mt-6 flex flex-col sm:flex-row justify-center gap-4 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
          <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-foreground border border-border px-8 py-3.5 hover:bg-muted transition-all duration-500">
            Speak to an Advisor
          </ContactButton>
        </div>
      </div>
      <div className="py-10 md:py-14" />
    </section>
  );
};

export default ProcessSection;
