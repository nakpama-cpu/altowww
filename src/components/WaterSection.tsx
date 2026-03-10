import { useEffect, useRef, useState } from "react";
import waterImg from "@/assets/water-source.jpg";

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
    <section id="water" className="section-light">
      <div className="py-32 md:py-48" />
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">II. The Water</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-12 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Glacial streams descend from 4,000 metres, carrying millennia of mineral memory.
        </h2>
        <p
          className={`font-body text-base leading-relaxed text-muted-foreground max-w-xl transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          The water that feeds our distillery has been filtered through ancient Andean rock 
          for thousands of years. Its unique mineral composition — rich in calcium and 
          silica — gives Alto its distinctive dry minerality that cannot be replicated 
          at lower altitudes.
        </p>
      </div>
      <div className="mt-20 md:mt-32">
        <img
          src={waterImg}
          alt="Crystal clear glacial stream flowing through rocky Andean terrain"
          className={`w-full h-[60vh] md:h-[80vh] object-cover transition-all duration-1000 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
};

export default WaterSection;
