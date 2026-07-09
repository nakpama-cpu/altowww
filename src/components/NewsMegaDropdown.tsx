import { Link } from "react-router-dom";
import { articles, type Article } from "@/data/articles";

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

const parseArticleDate = (d: string): number => {
  const parts = d.trim().split(/\s+/);
  if (parts.length !== 2) return 0;
  const m = MONTHS[parts[0].toLowerCase()] ?? 0;
  const y = parseInt(parts[1], 10) || 0;
  return new Date(y, m, 1).getTime();
};

const sortedArticles: Article[] = [...articles].sort(
  (a, b) => parseArticleDate(b.date) - parseArticleDate(a.date)
);

interface Props {
  open: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Card = ({ article }: { article: Article }) => (
  <Link
    to={`/news/${article.slug}`}
    className="group flex-shrink-0 w-[320px] mr-6 flex gap-4 items-start"
  >
    <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div className="min-w-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="font-body text-[9px] uppercase tracking-[0.2em] text-primary">
          {article.category}
        </span>
        <span className="w-1 h-1 rounded-full bg-secondary-foreground/30" />
        <span className="font-body text-[9px] uppercase tracking-[0.15em] text-secondary-foreground/50">
          {article.date}
        </span>
      </div>
      <h3 className="font-display text-[14px] font-light leading-snug text-secondary-foreground group-hover:text-primary transition-colors duration-300 line-clamp-3">
        {article.title}
      </h3>
    </div>
  </Link>
);

const NewsMegaDropdown = ({ open, onMouseEnter, onMouseLeave }: Props) => {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute left-0 right-0 top-full mt-0 bg-secondary/95 backdrop-blur-md border-t border-secondary-foreground/10 transition-all duration-300 overflow-hidden ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-7 pt-5 pb-12">
        <div className="flex items-center justify-between mb-4">
          <p className="chapter-marker text-secondary-foreground/60">
            News &amp; Insights
          </p>
          <Link
            to="/news"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-0.5 hover:border-primary transition-colors"
          >
            View All →
          </Link>
        </div>
        <div
          className="group/marquee overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)" }}
        >
          <div
            className="flex w-max animate-logo-scroll motion-reduce:animate-none group-hover/marquee:[animation-play-state:paused]"
            style={{ animationDuration: "90s" }}
          >
            {sortedArticles.map((a) => (
              <Card key={`a-${a.slug}`} article={a} />
            ))}
            {sortedArticles.map((a) => (
              <Card key={`b-${a.slug}`} article={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsMegaDropdown;
