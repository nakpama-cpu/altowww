import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "582%", label: "Rare whisky appreciation over 10 years" },
  { value: "£4.2B", label: "Global whisky market value" },
  { value: "12+", label: "Years of expert portfolio advisory" },
];

const InvestmentSection = () => {
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
    <section className="section-light">
      <div className="py-32 md:py-48" />
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8">The Investment</p>
        <h2
          className={`display-heading text-3xl md:text-5xl mb-16 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Secure your future with the best performing collectible of the decade.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`transition-all duration-1000 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${300 + i * 200}ms` }}
            >
              <p className="font-display text-4xl md:text-5xl text-primary font-light mb-3">
                {stat.value}
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <p
          className={`mt-16 font-body text-base leading-relaxed text-muted-foreground max-w-xl transition-all duration-1000 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Whether you have a passion for whisky or you're looking to leverage a 
          reliable long-term hold, our team of expert Portfolio Advisors can help you 
          start, manage, and sell your collection when the time is right.
        </p>
      </div>
      <div className="py-24" />
    </section>
  );
};

export default InvestmentSection;
