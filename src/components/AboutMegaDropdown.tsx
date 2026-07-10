import { Link } from "react-router-dom";
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

const Card = ({
  item,
}: {
  item: (typeof items)[number];
}) => (
  <Link
    to={item.to}
    className="group flex-shrink-0 w-[260px] md:w-[280px] lg:w-[300px] xl:w-[340px] flex gap-4 items-center"
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

const AboutMegaDropdown = ({ open, onMouseEnter }: Props) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={`absolute left-0 right-0 top-full mt-0 bg-secondary/95 backdrop-blur-md transition-all duration-300 overflow-hidden min-h-[170px] md:min-h-[190px] ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 pt-3 pb-3">
        <div className="mb-3">
          <p className="chapter-marker text-secondary-foreground/60">
            About Whisky
          </p>
        </div>
        <div className="flex justify-center gap-6">
          {items.map((item) => (
            <Card key={item.to} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutMegaDropdown;
