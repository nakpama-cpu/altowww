import Seo from "@/components/Seo";
import Header from "@/components/Header";
import FooterSection from "@/components/FooterSection";
import PageHero from "@/components/PageHero";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { articles } from "@/data/articles";
import { usePageSize } from "@/hooks/usePageSize";
import { Search, SlidersHorizontal } from "lucide-react";
import heroImg from "@/assets/whisky-investment-news.jpg";

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

type SortKey = "newest" | "oldest" | "az" | "za";

const News = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [category, setCategory] = useState<string>("all");
  const pageSize = usePageSize();
  const initialPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const [page, setPage] = useState(initialPage);

  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (page > 1) next.set("page", String(page));
    else next.delete("page");
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [page, searchParams, setSearchParams]);

  const totalPages = Math.max(1, Math.ceil(
    articles.filter((a) => {
      if (category !== "all" && a.category !== category) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return `${a.title} ${a.excerpt} ${a.category} ${a.date}`.toLowerCase().includes(q);
    }).length / pageSize
  ));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);



  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = articles.slice();
    if (category !== "all") {
      list = list.filter((a) => a.category === category);
    }
    if (q) {
      list = list.filter((a) => {
        const haystack = `${a.title} ${a.excerpt} ${a.category} ${a.date}`.toLowerCase();
        return haystack.includes(q);
      });
    }
    list.sort((a, b) => {
      switch (sort) {
        case "newest":
          return parseArticleDate(b.date) - parseArticleDate(a.date);
        case "oldest":
          return parseArticleDate(a.date) - parseArticleDate(b.date);
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
      }
    });
    return list;
  }, [query, sort, category]);

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
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-12 md:mb-16">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="news-search"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search articles..."
                  className="w-full bg-background border border-border pl-11 pr-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div className="relative flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                <label htmlFor="news-category" className="sr-only">
                  Filter by sector
                </label>
                <select
                  id="news-category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="appearance-none cursor-pointer bg-background border border-border pl-4 pr-10 py-3 font-body text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="all">All sectors</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <label htmlFor="news-sort" className="sr-only">
                  Sort articles
                </label>
                <select
                  id="news-sort"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as SortKey);
                    setPage(1);
                  }}
                  className="appearance-none cursor-pointer bg-background border border-border pl-4 pr-10 py-3 font-body text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="az">A–Z</option>
                  <option value="za">Z–A</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-body text-muted-foreground">
                  No articles match your search.
                </p>
                {query.trim() && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-4 font-body text-sm text-primary border-b border-primary/30 pb-0.5 hover:border-primary transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                  {filtered
                    .slice((page - 1) * pageSize, page * pageSize)
                    .map((article) => (
                    <Link
                      to={`/news/${article.slug}`}
                      state={{ fromPage: page }}
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
                        <span className="font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                          {article.date}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl md:text-3xl font-light leading-snug mb-3 group-hover:text-primary transition-colors duration-300">
                        {article.title}
                      </h2>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        {article.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>

                {filtered.length > pageSize && (() => {
                  const totalPages = Math.ceil(filtered.length / pageSize);
                  return (
                    <div className="mt-16 flex items-center justify-center gap-3">

                      <button
                        onClick={() => {
                          setPage((p) => Math.max(1, p - 1));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        disabled={page === 1}
                        className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-primary hover:text-primary transition-colors disabled:opacity-20 disabled:pointer-events-none"
                        aria-label="Previous page"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-10 h-10 flex items-center justify-center font-body text-sm border rounded-full transition-colors ${
                            p === page
                              ? "border-primary text-primary"
                              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                          }`}
                          aria-label={`Page ${p}`}
                          aria-current={p === page ? "page" : undefined}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setPage((p) => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        disabled={page === totalPages}
                        className="w-10 h-10 flex items-center justify-center border border-border rounded-full hover:border-primary hover:text-primary transition-colors disabled:opacity-20 disabled:pointer-events-none"
                        aria-label="Next page"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  );
                })()}
              </>
            )}

          </div>
        </section>

        <FooterSection />
      </div>
    </div>
  );
};

export default News;
