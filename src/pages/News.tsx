import Seo from "@/components/Seo";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import PageHero from "@/components/PageHero";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { articles } from "@/data/articles";
import heroImg from "@/assets/whisky-investment-news.jpg";

const News = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative">
      <Seo
        title="News & Insights | Alto Whisky"
        description="The latest news, market analysis, and expert insights on whisky cask investment, Scotch industry trends, and global demand."
        path="/news"
      />
      <Header />
      <PageHero image={heroImg} imageAlt="Whisky investment news" height="50vh">
        <p className="chapter-marker mb-6 text-secondary-foreground/70 animate-fade-in">
          News & Insights
        </p>
        <h1 className="display-heading text-4xl md:text-6xl text-secondary-foreground animate-fade-in-up">
          Articles & Market Updates
        </h1>
        <p
          className="mt-6 font-body text-sm md:text-base text-secondary-foreground/80 max-w-lg tracking-wide leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          Stay informed with the latest whisky market insights, distillery
          news, and investment guides from our expert team.
        </p>
      </PageHero>

      <div className="relative z-10">
        {/* Articles Grid */}
        <section className="section-light py-24 md:py-32">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {articles.map((article) => (
                <Link
                  to={`/news/${article.slug}`}
                  key={article.slug}
                  className="group block"
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
                  <h2 className="font-display text-xl font-light leading-snug mb-3 group-hover:text-primary transition-colors duration-300">
                    {article.title}
                  </h2>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {article.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
};

export default News;
