## Goal
Add 5 new news articles to the News & Insights page, all based on real, verifiable positive whisky stories from roughly the last 3 months, spanning: investment/cask market, distillery news, industry & exports, and sustainability & innovation.

## Research approach
1. Use web search (Firecrawl/web search) to find real, recent positive whisky stories from reputable sources (Scotch Whisky Association, BBC, Reuters, Whisky Magazine, The Spirits Business, Scotsman, Sotheby's, Bonhams, distiller press releases).
2. Verify each story with at least one credible source before writing. No invented facts, figures or quotes.
3. Aim for one story per topic + one flexible pick:
   - Investment & cask market (e.g. notable auction result or index update)
   - Distillery news (new release, expansion or milestone)
   - Industry & exports (Scotch export figures or trade wins)
   - Sustainability & innovation (green distilling milestone)
   - +1 extra strong story from any of the above

## Content changes
Add 5 new entries to `src/data/articles.ts`, each following the existing `Article` shape:
- Unique `slug`, `category`, `date` (Month YYYY within last 3 months)
- Compelling `title` and 1–2 sentence `excerpt`
- `content`: 5–6 paragraphs, factual, citing sources inline in prose (e.g. "as reported by the BBC"), ending with an Alto Whisky tie-in paragraph consistent with existing articles
- Reuse existing images from `src/assets` (auction, distillery, sustainable, china-trade, investment, etc.) — no new image generation unless you request it

No changes needed to `News.tsx` — the list, search and sort already read from `articles`.

## Out of scope
- No image generation (reusing existing assets)
- No changes to article detail page layout
- No fictionalised quotes, prices or statistics — anything not verifiable will be cut

## Confirm
Approve and I'll research the stories and add the 5 articles. If you'd prefer new custom images per article instead of reusing existing ones, say so before approving.
