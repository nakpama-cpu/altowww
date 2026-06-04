import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { articles, type Article } from "@/data/articles";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const monthMap: Record<string, number> = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
};

function parseDate(dateStr: string): number {
  const [month, year] = dateStr.split(" ");
  return parseInt(year) * 100 + (monthMap[month] || 0);
}

type SortOption = "newest" | "oldest" | "title-az" | "title-za";

export default function PortalNews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = articles;

    if (query) {
      result = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }

    const sorted = [...result];
    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => parseDate(b.date) - parseDate(a.date));
        break;
      case "oldest":
        sorted.sort((a, b) => parseDate(a.date) - parseDate(b.date));
        break;
      case "title-az":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-za":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return sorted;
  }, [searchQuery, sortBy]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 md:mb-12">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mb-3">News & Insights</p>
        <h1 className="display-heading text-3xl md:text-4xl">Latest Articles</h1>
        <p className="font-body text-sm text-muted-foreground mt-3 max-w-2xl">
          Market updates, distillery news, and expert insights on whisky cask investment.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border"
          />
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-48 bg-background border-border">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title-az">Title A–Z</SelectItem>
            <SelectItem value="title-za">Title Z–A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-body text-muted-foreground">No articles found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredArticles.map((article) => (
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
