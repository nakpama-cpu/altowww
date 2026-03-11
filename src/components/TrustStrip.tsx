import { useEffect, useRef, useState } from "react";

const trustLogos = [
  { name: "Financial Times", display: "Financial Times" },
  { name: "The Telegraph", display: "The Telegraph" },
  { name: "Forbes", display: "Forbes" },
  { name: "Bloomberg", display: "Bloomberg" },
  { name: "The Scotsman", display: "The Scotsman" },
];

const TrustStrip = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="section-light border-b border-border"
    >
      <div className="py-10 md:py-14">
        <p
          className={`text-center font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 mb-8 transition-all duration-1000 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          As Featured In
        </p>
        <div
          className={`flex flex-wrap items-center justify-center gap-8 md:gap-16 px-6 transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {trustLogos.map((logo, i) => (
            <span
              key={logo.name}
              className="font-display text-lg md:text-xl tracking-wide text-muted-foreground/40 font-light transition-all duration-500 hover:text-muted-foreground/70"
              style={{ transitionDelay: `${300 + i * 100}ms` }}
            >
              {logo.display}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
