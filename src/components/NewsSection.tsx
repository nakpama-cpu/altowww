import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "@/data/articles";
import BrochureButton, { ContactButton } from "@/components/BrochureButton";

const VISIBLE_COUNT = 3;

const NewsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

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

  const maxStart = Math.max(0, articles.length - VISIBLE_COUNT);
  const canPrev = startIndex > 0;
  const canNext = startIndex < maxStart;
  
  // Each card: calc(33.333% - 26.667px), gap: 40px, so step = calc(33.333% + 13.333px)
  const stepPercent = 100 / VISIBLE_COUNT; // 33.333
  const gap = 40;
  const cardMarginShare = ((VISIBLE_COUNT - 1) * gap) / VISIBLE_COUNT; // 26.667
  const stepOffset = gap - cardMarginShare; // 13.333

  return (
    <section ref={ref} className="section-light py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p
          className={`chapter-marker mb-6 text-muted-foreground/50 transition-all duration-1000 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          News & Insights
        </p>
        <div className="flex items-end justify-between mb-12">
          <h2
            className={`display-heading text-3xl md:text-4xl transition-all duration-1000 delay-200 ${
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
            className="flex transition-transform duration-700 ease-in-out gap-10"
            style={{
              transform: `translateX(calc(-${startIndex} * (${100 / VISIBLE_COUNT}% + ${40 - (40 * VISIBLE_COUNT - 40) / VISIBLE_COUNT / VISIBLE_COUNT}px)))`,
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
                  width: `calc(${100 / VISIBLE_COUNT}% - ${((VISIBLE_COUNT - 1) * 40) / VISIBLE_COUNT}px)`,
                  marginRight: i < articles.length - 1 ? "40px" : "0",
                  transitionDelay: `${300 + i * 150}ms`,
                }}
              >
                <div className="aspect-[4/3] overflow-hidden mb-5">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-body text-[10px] uppercase tracking-[0.2em] text-primary">
                    {article.category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
                    {article.date}
                  </span>
                </div>
                <h3 className="font-display text-lg font-light leading-snug mb-3 group-hover:text-primary transition-colors duration-300">
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
        <div className="mt-10 flex flex-col items-center gap-4 md:hidden">
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
              {startIndex + 1}–{Math.min(startIndex + VISIBLE_COUNT, articles.length)} of {articles.length}
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

        {/* CTA */}
        <div
          className={`mt-16 pt-16 border-t border-border text-center transition-all duration-1000 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h3 className="display-heading text-2xl md:text-3xl mb-4">
            Ready to get started?
          </h3>
          <p className="font-body text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Download our free brochure or speak with one of our expert Portfolio Advisors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BrochureButton className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3.5 hover:opacity-90 transition-opacity" />
            <ContactButton className="font-body text-xs uppercase tracking-[0.25em] text-foreground border border-border px-8 py-3.5 hover:bg-muted transition-all duration-500">
              Contact Us
            </ContactButton>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
