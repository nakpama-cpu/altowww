import { Link } from "react-router-dom";
import { articles } from "@/data/articles";

export default function PortalNews() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 md:mb-12">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mb-3">News & Insights</p>
        <h1 className="display-heading text-3xl md:text-4xl">Latest Articles</h1>
        <p className="font-body text-sm text-muted-foreground mt-3 max-w-2xl">
          Market updates, distillery news, and expert insights on whisky cask investment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {articles.map((article) => (
          <Link
            to={`/news/${article.slug}`}
            key={article.slug}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="aspect-[4/3] overflow-hidden mb-4">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-body text-[10px] uppercase tracking-[0.2em] text-primary">
                {article.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50">
                {article.date}
              </span>
            </div>
            <h2 className="font-display text-lg font-light leading-snug mb-2 group-hover:text-primary transition-colors duration-300">
              {article.title}
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
