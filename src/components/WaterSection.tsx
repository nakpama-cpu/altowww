import { useEffect, useRef, useState } from "react";
import warehouseImg from "@/assets/warehouse-casks.jpg";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";

const WaterSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="opportunity" className="section-light">
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-340px)] flex flex-col justify-start pt-20 md:pt-24">
          <p className="chapter-marker mb-8">The Opportunity</p>
          <h2
            className={`display-heading text-3xl md:text-5xl mb-6 transition-all duration-1000 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Whisky cask investment is now widely considered to be one of the most secure assets available for long or medium term holds – alongside none other than gold.
          </h2>
        </div>
        <p
          className={`font-body text-base leading-relaxed text-muted-foreground max-w-xl mb-6 transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          If you're interested in investing in whisky but aren't sure where to start, or you're simply looking for the next addition to your asset portfolio, you're in the right place. Alto Whisky's team of expert Portfolio Advisors can help you start, manage, and sell your collection when the time is right.
        </p>
        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
          <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-foreground border border-border px-8 py-3.5 hover:bg-muted transition-all duration-500">
            Speak to an Advisor
          </ContactButton>
        </div>
      </div>
      <div className="mt-12 md:mt-16">
        <img
          src={warehouseImg}
          alt="Oak whisky cask on the shore of a Scottish loch with mountains in the background"
          className={`w-full h-[40vh] md:h-[60vh] object-cover transition-all duration-1000 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
};

export default WaterSection;
