import { useEffect, useRef, useState } from "react";
import warehouseImg from "@/assets/warehouse-casks.jpg";
import { Link } from "react-router-dom";

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
      <div className="py-32 md:py-48" />
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">The Opportunity</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-12 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          The world of whisky exudes class, quality, and heritage — providing a
          unique opportunity for discerning investors.
        </h2>
        <p
          className={`font-body text-base leading-relaxed text-muted-foreground max-w-xl mb-6 transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Whisky cask investment is now widely considered to be one of the most
          secure assets available for long or medium term holds — alongside none
          other than gold. If you're interested in investing in whisky but aren't
          sure where to start, or you're simply looking for the next addition to
          your asset portfolio, you're in the right place.
        </p>
        <p
          className={`font-body text-base leading-relaxed text-muted-foreground max-w-xl mb-8 transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Alto Whisky's team of expert Portfolio Advisors can help you start,
          manage, and sell your collection when the time is right. We source casks
          from Scotland's finest distilleries and beyond, bringing this
          opportunity to people from all walks of life.
        </p>
        <Link
          to="/why-whisky"
          className={`inline-block font-body text-xs uppercase tracking-[0.25em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all duration-500 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Why Whisky →
        </Link>
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
