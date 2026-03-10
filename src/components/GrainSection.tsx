import { useEffect, useRef, useState } from "react";
import grainImg from "@/assets/grain-field.jpg";

const GrainSection = () => {
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
    <section id="grain" className="section-light">
      <div className="py-32 md:py-48" />
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">III. The Grain</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-12 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          High-altitude barley, hardened by sun and frost, yields a grain of uncommon character.
        </h2>
        <p
          className={`font-body text-base leading-relaxed text-muted-foreground max-w-xl transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          At 2,500 metres, our barley grows slower, concentrating sugars and developing 
          a complexity that flatland grain simply cannot achieve. Each harvest is a negotiation 
          with the mountain — and the mountain always has the final word.
        </p>
      </div>
      <div className="mt-20 md:mt-32">
        <img
          src={grainImg}
          alt="Golden barley field at sunset with Andes mountains in background"
          className={`w-full h-[60vh] md:h-[80vh] object-cover transition-all duration-1000 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
};

export default GrainSection;
