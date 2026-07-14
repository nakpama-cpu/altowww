import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://www.altowhisky.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/how-it-works", changefreq: "monthly", priority: "0.8" },
  { path: "/why-whisky", changefreq: "monthly", priority: "0.8" },
  { path: "/about-whisky", changefreq: "monthly", priority: "0.8" },
  { path: "/how-whisky-is-made", changefreq: "monthly", priority: "0.8" },
  { path: "/faqs", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/news", changefreq: "weekly", priority: "0.7" },
  { path: "/news/china-slashes-whisky-import-duty-2026", changefreq: "monthly", priority: "0.6" },
  { path: "/news/whisky-casks-outperform-traditional-assets", changefreq: "monthly", priority: "0.6" },
  { path: "/news/tax-free-investment-whisky-cask-wasting-asset", changefreq: "monthly", priority: "0.6" },
  { path: "/news/scotlands-most-sought-after-distilleries", changefreq: "monthly", priority: "0.6" },
  { path: "/news/how-whisky-casks-are-stored-bonded-warehouses", changefreq: "monthly", priority: "0.6" },
  { path: "/news/five-whisky-regions-scotland-investor-guide", changefreq: "monthly", priority: "0.6" },
  { path: "/news/beginners-guide-whisky-cask-investment-2026", changefreq: "monthly", priority: "0.6" },
];

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
