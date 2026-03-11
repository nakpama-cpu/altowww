import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "@/data/articles";
import { useIsMobile } from "@/hooks/use-mobile";

const NewsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const isMobile = useIsMobile();

  const visibleCount = isMobile ? 1 : 3;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Reset startIndex when switching between mobile/desktop
  useEffect(() => {
    setStartIndex(0);
  }, [isMobile]);

  const maxStart = Math.max(0, articles.length - visibleCount);
  const canPrev = startIndex > 0;
  const canNext = startIndex < maxStart;

  const stepPercent = 100 / visibleCount;
  const gap = isMobile ? 0 : 40;
  const cardMarginShare = visibleCount > 1 ? ((visibleCount - 1) * gap) / visibleCount : 0;
  const stepOffset = visibleCount > 1 ? gap - cardMarginShare : 0;

  return (
    <section ref={ref} className="section-light py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p
          className={`chapter-marker mb-6 text-muted-foreground/50 transition-all duration-1000 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          News & Insights
        </p>
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <h2
            className={`display-heading text-2xl md:text-4xl transition-all duration-1000 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Latest from the world of whisky.
          </h2>
          <div
            className={`hidden md:flex items-center gap-4 transition-all duration-1000 delay-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
                disabled={!canPrev}
                className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-primary hover:text-primary transition-colors disabled:opacity-20 disabled:pointer-events-none"
                aria-label="Previous articles"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setStartIndex((i) => Math.min(maxStart, i + 1))}
                disabled={!canNext}
                className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-primary hover:text-primary transition-colors disabled:opacity-20 disabled:pointer-events-none"
                aria-label="Next articles"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <Link
              to="/news"
              className="font-body text-xs uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-colors"
            >
              View All →
            </Link>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className={`flex transition-transform duration-700 ease-in-out ${isMobile ? "gap-0" : "gap-10"}`}
            style={{
              transform: `translateX(calc(${-startIndex} * (${stepPercent}% + ${stepOffset}px)))`,
            }}
          >
            {articles.map((article, i) => (
              <Link
                to={`/news/${article.slug}`}
                key={article.slug}
                className={`group block flex-shrink-0 transition-opacity duration-700 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  width: isMobile ? "100%" : `calc(${stepPercent}% - ${cardMarginShare}px)`,
                  transitionDelay: `${300 + i * 150}ms`,
                }}
              >
                <div className="aspect-[4/3] overflow-hidden mb-4 md:mb-5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-3 mb-2 md:mb-3">
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-primary">
                    {article.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
                    {article.date}
                  </span>
                </div>
                <h3 className="font-display text-base md:text-lg font-light leading-snug mb-2 md:mb-3 group-hover:text-primary transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="mt-8 flex flex-col items-center gap-4 md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
              disabled={!canPrev}
              className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-primary hover:text-primary transition-colors disabled:opacity-20 disabled:pointer-events-none"
              aria-label="Previous articles"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-body text-xs text-muted-foreground/50">
              {startIndex + 1} of {articles.length}
            </span>
            <button
              onClick={() => setStartIndex((i) => Math.min(maxStart, i + 1))}
              disabled={!canNext}
              className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-primary hover:text-primary transition-colors disabled:opacity-20 disabled:pointer-events-none"
              aria-label="Next articles"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <Link
            to="/news"
            className="font-body text-xs uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-colors"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
