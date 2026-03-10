import { useEffect, useRef, useState } from "react";
import bottleImg from "@/assets/bottle.jpg";

const tastingNotes = [
  "Dry Minerality",
  "Smoked Cacao",
  "Highland Honey",
  "Burnt Amber",
];

const GlassSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

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
      id="glass"
      ref={ref}
      className="section-dark min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background tasting notes */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 md:gap-8 pointer-events-none">
        {tastingNotes.map((note) => (
          <span
            key={note}
            className={`tasting-note ${hovered ? "tasting-note-visible" : ""}`}
          >
            {note}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <p
          className={`chapter-marker mb-12 text-secondary-foreground/50 transition-all duration-1000 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          IV. The Glass
        </p>
        <div
          className={`transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={bottleImg}
            alt="Alto Whisky bottle with warm amber liquid, dramatic lighting"
            className="w-64 md:w-80 mx-auto"
          />
        </div>
        <div
          className={`mt-16 space-y-4 transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-body text-sm text-secondary-foreground/60 uppercase tracking-[0.2em]">
            Single Malt · 45% ABV · Aged 12 Years
          </p>
          <h2 className="display-heading text-3xl md:text-4xl text-secondary-foreground">
            Taste the altitude.
          </h2>
        </div>
      </div>
    </section>
  );
};

export default GlassSection;
