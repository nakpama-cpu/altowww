import { useEffect, useRef, useState } from "react";
import scotlandImg from "@/assets/scotland-landscape.jpg";
import { Link } from "react-router-dom";
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

  const logos = distilleries;

  return (
    <section id="distilleries" className="section-dark">
      <div className="py-10 md:py-16" />
      <div ref={ref} className="max-w-3xl mx-auto px-6 md:px-12">
        <p className="chapter-marker mb-8 text-secondary-foreground/50">The Distilleries</p>
        <h2
          className={`display-heading text-3xl md:text-5xl text-secondary-foreground mb-8 transition-all duration-1000 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Access casks from Scotland's most prestigious distilleries.
        </h2>
        <p
          className={`font-body text-base leading-relaxed text-secondary-foreground/70 max-w-xl mb-6 transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Scotland is home to over 130 active distilleries, each producing whisky with its own distinct character shaped by local water sources, climate, and centuries of tradition. From the peated intensity of Islay's coastal malts to the honeyed elegance of Speyside's finest, every region offers something unique.
        </p>
        <p
          className={`font-body text-base leading-relaxed text-secondary-foreground/70 max-w-xl transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Alto Whisky provides access to casks from a curated selection of Scotland's most sought-after distilleries — names that carry global recognition, collectability, and proven appreciation in value over time.
        </p>
        <div
          className={`mt-8 transition-all duration-1000 delay-600 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            to="/about-whisky"
            className="font-body text-xs uppercase tracking-[0.25em] text-secondary-foreground border border-secondary-foreground/30 px-8 py-3.5 hover:bg-secondary-foreground/10 transition-all duration-500 inline-block"
          >
            Explore Regions →
          </Link>
        </div>
      </div>

      {/* Distillery Logo Carousel */}
      <div
        className={`mt-12 md:mt-16 overflow-hidden transition-all duration-1000 delay-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-center font-body text-xs uppercase tracking-[0.25em] text-secondary-foreground/30 mb-10">
          Whisky Casks We Have Access To
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-logo-scroll">
            {[...logos, ...logos].map((d, i) => (
              <div
                key={`${d.name}-${i}`}
                className="flex-shrink-0 w-[200px] md:w-[260px] mx-4 md:mx-6 flex items-center justify-center h-32"
              >
                <img
                  src={d.logo}
                  alt={`${d.name} distillery logo`}
                  className="max-h-28 max-w-[220px] object-contain opacity-60 hover:opacity-100 transition-opacity duration-500 invert grayscale hover:grayscale-0"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-16">
        <img
          src={scotlandImg}
          alt="Aerial view of Scottish Highland distillery surrounded by green rolling hills and a winding river"
          className={`w-full h-[50vh] md:h-[70vh] object-cover transition-all duration-1000 delay-500 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </section>
  );
};

export default GrainSection;
