import { useEffect, useRef, useState } from "react";
import caskImg from "@/assets/cask-closeup.jpg";

const GlassSection = () => {
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
    <section
      id="cask"
      ref={ref}
      className="section-dark min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div
          className={`transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <img
            src={caskImg}
            alt="Close-up of an oak whisky cask with a glass of golden amber whisky"
            className="w-full rounded-sm"
          />
        </div>
        <div>
          <p
            className={`chapter-marker mb-8 text-secondary-foreground/50 transition-all duration-1000 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            Your Cask
          </p>
          <h2
            className={`display-heading text-3xl md:text-4xl text-secondary-foreground mb-8 transition-all duration-1000 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Own a piece of liquid gold.
          </h2>
          <div
            className={`space-y-6 transition-all duration-1000 delay-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed">
              Every cask you purchase through Alto Whisky is stored at HMRC 
              government-bonded warehouses across Scotland, fully covered by 
              insurance and exempt from taxation.
            </p>
            <p className="font-body text-sm text-secondary-foreground/60 leading-relaxed">
              You receive official certificates of ownership and regular market 
              updates from your dedicated Portfolio Advisor. When the time is right, 
              we'll help you sell or bottle your whisky.
            </p>
            <a
              href="https://www.altowhisky.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 font-body text-xs uppercase tracking-[0.25em] text-primary border border-primary/30 px-8 py-3 hover:bg-primary/10 transition-all duration-500"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlassSection;
