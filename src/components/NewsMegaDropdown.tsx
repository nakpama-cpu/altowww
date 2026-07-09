import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
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
    className="group flex-shrink-0 w-[340px] mr-5 flex gap-4 items-center"
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
      <div className="flex items-center gap-2 mb-1">
        <span className="font-body text-[9px] uppercase tracking-[0.2em] text-primary">
          {article.category}
        </span>
        <span className="w-1 h-1 rounded-full bg-secondary-foreground/30" />
        <span className="font-body text-[9px] uppercase tracking-[0.15em] text-secondary-foreground/50">
          {article.date}
        </span>
      </div>
      <h3 className="font-display text-[15px] font-light leading-snug text-secondary-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
        {article.title}
      </h3>
    </div>
  </Link>
);

const NewsMegaDropdown = ({ open, onMouseEnter, onMouseLeave }: Props) => {
  const [query, setQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedArticles;
    return sortedArticles.filter((a) => {
      const haystack = `${a.title} ${a.category} ${a.excerpt} ${a.slug.replace(/-/g, " ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.6), behavior: "smooth" });
  };

  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!open || paused || query.trim()) return;
    const el = scrollRef.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 1, behavior: "auto" });
      }
    }, 30);
    return () => window.clearInterval(id);
  }, [open, paused, query]);

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
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-4">
        <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
          <p className="chapter-marker text-secondary-foreground/60">
            News &amp; Insights
          </p>
          <div className="flex items-center gap-2 bg-secondary-foreground/5 border border-secondary-foreground/10 px-3 py-1.5 flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-secondary-foreground/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles"
              className="bg-transparent outline-none border-none text-secondary-foreground placeholder:text-secondary-foreground/40 font-body text-xs w-full"
            />
          </div>
          <Link
            to="/news"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-0.5 hover:border-primary transition-colors"
          >
            View All →
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
            {filtered.length === 0 ? (
              <p className="font-body text-xs text-secondary-foreground/60 py-6 text-center">
                No articles match "{query}".
              </p>
            ) : (
              <div className="flex w-max py-2">
                {filtered.map((a) => (
                  <Card key={a.slug} article={a} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsMegaDropdown;
