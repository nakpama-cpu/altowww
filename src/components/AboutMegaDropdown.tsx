import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import regionsImg from "@/assets/scotland-landscape.jpg";
import processImg from "@/assets/nav-how-whisky-made.jpg";
import faqImg from "@/assets/nav-faqs.jpg";

interface Props {
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave?: () => void;
}

const items = [
  {
    to: "/about-whisky",
    label: "Regions & Distilleries",
    tagline: "Explore Scotland",
    description:
      "Discover the six whisky regions of Scotland and the distilleries that shape their distinctive character.",
    image: regionsImg,
  },
  {
    to: "/how-whisky-is-made",
    label: "How Whisky is Made",
    tagline: "The Craft",
    description:
      "From barley to bottle — the traditional process behind every cask of single malt Scotch.",
    image: processImg,
  },
  {
    to: "/faqs",
    label: "FAQs",
    tagline: "Answers",
    description:
      "Common questions on cask ownership, maturation, storage and investment — clearly answered.",
    image: faqImg,
  },
];

const Card = ({ item }: { item: (typeof items)[number] }) => (
  <Link
    to={item.to}
    className="group flex-shrink-0 w-[340px] mr-5 flex gap-4 items-center"
  >
    <div className="w-28 h-28 flex-shrink-0 overflow-hidden aspect-square">
      <img
        src={item.image}
        alt={item.label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-body text-[9px] uppercase tracking-[0.2em] text-primary">
          {item.tagline}
        </span>
      </div>
      <h3 className="font-display text-[15px] font-light leading-snug text-secondary-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-1">
        {item.label}
      </h3>
      <p className="font-body text-[11px] leading-relaxed text-secondary-foreground/60 line-clamp-2">
        {item.description}
      </p>
    </div>
  </Link>
);

const AboutMegaDropdown = ({ open, onMouseEnter, onMouseLeave }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(320, el.clientWidth * 0.6);
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
    const atStart = el.scrollLeft <= 2;
    if (dir === 1 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && atStart) {
      el.scrollTo({ left: el.scrollWidth - el.clientWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * step, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!open || paused) return;
    const el = scrollRef.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        el.scrollLeft = 0;
      } else {
        el.scrollBy({ left: 1, behavior: "auto" });
      }
    }, 30);
    return () => window.clearInterval(id);
  }, [open, paused]);

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 right-0 top-full mt-0 bg-secondary/95 backdrop-blur-md transition-all duration-300 overflow-hidden min-h-[170px] md:min-h-[190px] ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 pt-3 pb-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-3">
          <p className="chapter-marker text-secondary-foreground/60 justify-self-start">
            About Whisky
          </p>
          <span />
          <Link
            to="/about-whisky"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-0.5 hover:border-primary transition-colors justify-self-end"
          >
            Explore →
          </Link>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-secondary/90 border border-secondary-foreground/10 text-secondary-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-secondary/90 border border-secondary-foreground/10 text-secondary-foreground/70 hover:text-primary hover:border-primary/40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth px-10"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
              scrollbarWidth: "none",
            }}
          >
            <div className="flex w-max py-2">
              {items.map((item) => (
                <Card key={item.to} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMegaDropdown;
