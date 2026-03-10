import { useEffect, useRef, useState } from "react";
import warehouseImg from "@/assets/warehouse-casks.jpg";

const WaterSection = () => {
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
    <section id="opportunity" className="section-light">
      <div className="py-32 md:py-48" />
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">The Opportunity</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-12 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          The world of whisky exudes class, quality, and heritage — providing a unique opportunity for discerning investors.
        </h2>
        <p
          className={`font-body text-base leading-relaxed text-muted-foreground max-w-xl transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Whisky cask investment is now widely considered to be one of the most secure 
          assets available for long or medium term holds — alongside none other than gold. 
          Alto Whisky was born to bring this opportunity to people from all walks of life, 
          sourcing casks from Scotland's finest distilleries and beyond.
        </p>
      </div>
      <div className="mt-20 md:mt-32">
        <img
          src={warehouseImg}
          alt="Interior of a Scottish whisky warehouse with rows of oak casks in atmospheric golden light"
          className={`w-full h-[60vh] md:h-[80vh] object-cover transition-all duration-1000 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
};

export default WaterSection;
