import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "@/data/articles";

const NewsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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

  const featured = articles.slice(0, 3);

  return (
    <section ref={ref} className="section-light py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p
          className={`chapter-marker mb-6 text-muted-foreground/50 transition-all duration-1000 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          News & Insights
        </p>
        <div className="flex items-end justify-between mb-16">
          <h2
            className={`display-heading text-3xl md:text-4xl transition-all duration-1000 delay-200 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Latest from the world of whisky.
          </h2>
          <Link
            to="/news"
            className={`hidden md:inline-block font-body text-xs uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-all duration-1000 delay-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            View All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {featured.map((article, i) => (
            <Link
              to={`/news/${article.slug}`}
              key={article.slug}
              className={`group block transition-all duration-1000 ${
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${300 + i * 150}ms` }}
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

        <div className="mt-10 text-center md:hidden">
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
