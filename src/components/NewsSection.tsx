import { useEffect, useRef, useState } from "react";
import whiskyTastingImg from "@/assets/whisky-tasting.jpg";
import distilleryStillsImg from "@/assets/distillery-stills.jpg";
import whiskyInvestmentImg from "@/assets/whisky-investment-news.jpg";

const articles = [
  {
    image: whiskyInvestmentImg,
    category: "Market Insight",
    date: "February 2026",
    title: "Whisky Casks Outperform Traditional Assets for Tenth Consecutive Year",
    excerpt:
      "The Knight Frank Luxury Investment Index reveals whisky casks have delivered 582% returns over the past decade, outpacing wine, art, and classic cars.",
  },
  {
    image: distilleryStillsImg,
    category: "Distillery News",
    date: "January 2026",
    title: "Inside Scotland's Most Sought-After Single Malt Distilleries",
    excerpt:
      "We explore the Highland and Speyside distilleries producing some of the most collectible casks available to private investors today.",
  },
  {
    image: whiskyTastingImg,
    category: "Investment Guide",
    date: "December 2025",
    title: "A Beginner's Guide to Whisky Cask Investment in 2026",
    excerpt:
      "Everything you need to know about purchasing, storing, and selling whisky casks — from tax benefits to exit strategies.",
  },
];

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
        <h2
          className={`display-heading text-3xl md:text-4xl mb-16 transition-all duration-1000 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Latest from the world of whisky.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {articles.map((article, i) => (
            <article
              key={article.title}
              className={`group cursor-pointer transition-all duration-1000 ${
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
