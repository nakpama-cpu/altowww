import Seo from "@/components/Seo";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { getArticleBySlug, articles } from "@/data/articles";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = (location.state as { fromPage?: number } | null)?.fromPage;
  const newsBackTo = fromPage && fromPage > 1 ? `/news?page=${fromPage}` : "/news";
  const carryState = fromPage ? { fromPage } : undefined;
  const article = getArticleBySlug(slug || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    navigate("/news");
    return null;
  }

  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <div className="relative">
      <Seo
        title={`${article.title.slice(0, 44)} | Alto Whisky`}
        description={article.excerpt.slice(0, 158)}
        path={`/news/${article.slug}`}
        type="article"
        image={article.image}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: article.image.startsWith("http")
            ? article.image
            : `https://altowww.lovable.app${article.image}`,
          datePublished: article.date,
          author: { "@type": "Organization", name: "Alto Whisky" },
          publisher: { "@type": "Organization", name: "Alto Whisky" },
          mainEntityOfPage: `https://altowww.lovable.app/news/${article.slug}`,
        }}
      />
      <Header />

      {/* Hero Image — matches homepage sizing */}
      <section className="relative w-full overflow-hidden h-auto min-h-[380px] md:h-[380px] md:min-h-0">
        <img
          src={article.image}
          alt={article.title}
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%] md:object-center"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        />
        <div className="absolute inset-0 bg-secondary/60" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-6 pt-20 pb-16 md:pt-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-primary">
              {article.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-secondary-foreground/30" />
            <span className="font-body text-[10px] uppercase tracking-[0.15em] text-secondary-foreground">
              {article.date}
            </span>
          </div>
          <h1 className="display-heading text-3xl md:text-5xl lg:text-6xl text-secondary-foreground max-w-4xl">
            {article.title}
          </h1>
        </div>
      </section>


      {/* Article Content */}
      <section className="section-light py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          <p className="font-body text-lg text-foreground leading-relaxed mb-8 first-letter:text-5xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-primary">
            {article.content[0]}
          </p>
          {article.content.slice(1).map((paragraph, i) => (
            <p
              key={i}
              className="font-body text-base text-muted-foreground leading-relaxed mb-6"
            >
              {paragraph}
            </p>
          ))}

        </div>
      </section>

      {/* Navigation */}
      <section className="section-light border-t border-border">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {prevArticle ? (
              <Link
                to={`/news/${prevArticle.slug}`}
                state={carryState}
                className="group py-10 md:pr-12"
              >
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  ← Previous Article
                </p>
                <p className="font-display text-lg font-light group-hover:text-primary transition-colors duration-300">
                  {prevArticle.title}
                </p>
              </Link>
            ) : (
              <div className="py-10 md:pr-12" />
            )}
            {nextArticle ? (
              <Link
                to={`/news/${nextArticle.slug}`}
                state={carryState}
                className="group py-10 md:pl-12 text-right"
              >
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Next Article →
                </p>
                <p className="font-display text-lg font-light group-hover:text-primary transition-colors duration-300">
                  {nextArticle.title}
                </p>
              </Link>
            ) : (
              <div className="py-10 md:pl-12" />
            )}
          </div>
        </div>
      </section>

      <div className="section-light text-center pb-12">
        <Link
          to={newsBackTo}
          className="font-body text-xs uppercase tracking-[0.2em] text-primary border-b border-primary/30 pb-1 hover:border-primary transition-colors"
        >
          ← Back to All Articles
        </Link>

      </div>

      <FooterSection />
    </div>
  );
};

export default ArticlePage;
