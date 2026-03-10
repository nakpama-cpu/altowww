import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import BrochureButton from "@/components/BrochureButton";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import warehouseImg from "@/assets/warehouse-casks.jpg";
import caskImg from "@/assets/cask-closeup.jpg";

const steps = [
  {
    number: "01",
    title: "Download Our Brochure",
    description:
      "Download our free brochure and compare the investment opportunities available to you. It's the perfect starting point to understand the whisky cask market.",
  },
  {
    number: "02",
    title: "Speak to a Portfolio Advisor",
    description:
      "Reach out to one of our expert Portfolio Advisors to discuss your requirements and identify your personal investment goals.",
  },
  {
    number: "03",
    title: "Secure Your Cask",
    description:
      "With the help of your Advisor, complete the necessary documentation and payments to authenticate your whisky cask investment.",
  },
  {
    number: "04",
    title: "Certificates of Ownership",
    description:
      "Receive your official certificates of ownership and rest assured knowing your casks are stored at HMRC government-bonded warehouses, covered by insurance and free from taxation.",
  },
  {
    number: "05",
    title: "Sit Back & Relax",
    description:
      "Your expert Advisor will share regular updates on the whisky market and how this impacts your current investment. We do the heavy lifting.",
  },
  {
    number: "06",
    title: "Sell or Bottle",
    description:
      "This part is up to you. If you decide to sell or bottle your whisky cask, we will be there every step of the way to assist. Otherwise, we're in this for the long haul.",
  },
];

const HowItWorks = () => {
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
      <Header />
      <BuyButton />

      {/* Hero */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={warehouseImg}
          alt="Scottish whisky warehouse with oak casks"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <p className="chapter-marker mb-6 text-secondary-foreground/70 animate-fade-in">
            The Process
          </p>
          <h1 className="display-heading text-4xl md:text-6xl lg:text-7xl text-secondary-foreground animate-fade-in-up">
            How It Works
          </h1>
          <p
            className="mt-6 font-body text-sm md:text-base text-secondary-foreground/80 max-w-lg tracking-wide leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Investing in whisky casks is a solid, dependable strategy, but one
            which requires intricate knowledge of the industry and its trends.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="section-light py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <p className="font-body text-base leading-relaxed text-muted-foreground max-w-xl">
            Whether you're looking to secure your liquidity for the long term, or
            even to bottle your cask over time and share it with friends and
            family as a unique, memorable gift, we're here to help. Our team
            guides you through every step of the process.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section-light pb-32">
        <div ref={ref} className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`transition-all duration-1000 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                <p className="font-display text-6xl text-primary/20 font-light mb-4">
                  {step.number}
                </p>
                <h3 className="font-display text-xl md:text-2xl font-light mb-4">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <h2 className="display-heading text-3xl md:text-5xl text-secondary-foreground mb-8">
            Ready to get started?
          </h2>
          <p className="font-body text-sm text-secondary-foreground/60 mb-10 max-w-md mx-auto leading-relaxed">
            Download our free brochure to learn more about whisky cask investment
            opportunities, or speak to one of our expert Portfolio Advisors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
            <a
              href="/contact"
              className="font-body text-xs uppercase tracking-[0.25em] text-secondary-foreground border border-secondary-foreground/30 px-8 py-3.5 hover:bg-secondary-foreground/10 transition-all duration-500"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default HowItWorks;
