import { Link } from "react-router-dom";
import regionsImg from "@/assets/scotland-landscape.jpg";
import processImg from "@/assets/nav-how-whisky-made.jpg";
import faqImg from "@/assets/nav-faqs.jpg";

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
    className="group flex-1 min-w-0 flex gap-3 items-center"
  >
    <div className="w-24 h-24 flex-shrink-0 overflow-hidden aspect-square">
      <img
        src={item.image}
        alt={item.label}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="min-w-0 flex-1">
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


const AboutPanel = () => {
  return (
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

      <div className="px-10">
        <div className="flex justify-between gap-5 py-2">
          {items.map((item) => (
            <Card key={item.to} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPanel;
