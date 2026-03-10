import { useEffect, useRef, useState } from "react";
import scotlandImg from "@/assets/scotland-landscape.jpg";

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
    <section id="distilleries" className="section-light">
      <div className="py-32 md:py-48" />
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">The Distilleries</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-12 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Casks sourced from Scotland's most prestigious distilleries and beyond.
        </h2>
        <p
          className={`font-body text-base leading-relaxed text-muted-foreground max-w-xl transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Whether you have a passion for whisky and appreciate the unmatched taste of 
          an 18-year, single barrel scotch, or you are simply looking to leverage a 
          reliable long-term hold, our team of expert Portfolio Advisors will identify 
          the right casks from distilleries throughout Scotland and the wider world to 
          match your investment goals.
        </p>
      </div>
      <div className="mt-20 md:mt-32">
        <img
          src={scotlandImg}
          alt="Aerial view of Scottish Highland distillery surrounded by green rolling hills and a winding river"
          className={`w-full h-[60vh] md:h-[80vh] object-cover transition-all duration-1000 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
};

export default GrainSection;
