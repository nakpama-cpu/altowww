import { useEffect, useRef, useState } from "react";
import scotlandImg from "@/assets/scotland-landscape.jpg";
import macallanLogo from "@/assets/logos/macallan.png";
import glenfiddichLogo from "@/assets/logos/glenfiddich.png";
import glenlivetLogo from "@/assets/logos/glenlivet.png";
import highlandParkLogo from "@/assets/logos/highland-park.png";
import lagavulinLogo from "@/assets/logos/lagavulin.png";
import ardbegLogo from "@/assets/logos/ardbeg.png";
import taliskerLogo from "@/assets/logos/talisker.png";
import dalmoreLogo from "@/assets/logos/dalmore.png";
import laphroaigLogo from "@/assets/logos/laphroaig.png";
import obanLogo from "@/assets/logos/oban.png";
import balvenieLogo from "@/assets/logos/balvenie.png";
import springbankLogo from "@/assets/logos/springbank.png";

const distilleries = [
  { name: "Macallan", logo: macallanLogo },
  { name: "Glenfiddich", logo: glenfiddichLogo },
  { name: "The Glenlivet", logo: glenlivetLogo },
  { name: "Highland Park", logo: highlandParkLogo },
  { name: "Lagavulin", logo: lagavulinLogo },
  { name: "Ardbeg", logo: ardbegLogo },
  { name: "Talisker", logo: taliskerLogo },
  { name: "The Dalmore", logo: dalmoreLogo },
  { name: "Laphroaig", logo: laphroaigLogo },
  { name: "Oban", logo: obanLogo },
  { name: "The Balvenie", logo: balvenieLogo },
  { name: "Springbank", logo: springbankLogo },
];

const GrainSection = () => {
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

  const logos = [...distilleries, ...distilleries];

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
          The world of whisky is one which exudes class, quality, and heritage.
        </h2>
        <p
          className={`font-body text-base leading-relaxed text-muted-foreground max-w-xl mb-6 transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          These three things elevate this revered spirit above many of its peers,
          providing a unique opportunity for discerning investors to protect and
          build their wealth. Alto Whisky was born to bring this opportunity to
          people from all walks of life.
        </p>
        <p
          className={`font-body text-base leading-relaxed text-muted-foreground max-w-xl transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Whether you have a passion for whisky and appreciate the unmatched
          taste of an 18-year, single barrel scotch, or you are just looking to
          leverage a reliable long-term hold, we want to help you.
        </p>
      </div>

      {/* Distillery Logo Carousel */}
      <div
        className={`mt-20 md:mt-28 overflow-hidden transition-all duration-1000 delay-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-center font-body text-xs uppercase tracking-[0.25em] text-muted-foreground/40 mb-10">
          Whisky Casks We Have Access To
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex animate-logo-scroll">
            {logos.map((d, i) => (
              <div
                key={`${d.name}-${i}`}
                className="flex-shrink-0 w-[180px] md:w-[220px] mx-6 md:mx-10 flex items-center justify-center h-24"
              >
                <img
                  src={d.logo}
                  alt={`${d.name} distillery logo`}
                  className="max-h-20 max-w-[160px] object-contain opacity-60 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
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
