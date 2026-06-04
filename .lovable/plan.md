## Goal
Replace the fabricated specifics in `src/data/articles.ts` with content grounded in real, verifiable Scotch whisky industry stories, while keeping the site's tone, structure, and Alto Whisky positioning intact.

## Audit of current articles

Fictional / unverifiable (must be rewritten):
1. **Rare 1978 Macallan Cask £2.8m auction (June 2026)** — invented sale/price.
2. **Scottish Whisky Tourism 3M visitors (May 2026)** — invented stat.
3. **New £50m Speyburn Glen Distillery (May 2026)** — distillery does not exist.
4. **China Slashes Whisky Import Duty to 5% (March 2026)** — no such UK–China deal.

Largely accurate but to fact-check & tighten:
5. **Green Revolution (April 2026)** — real direction (SWA Net Zero by 2040 is real), but specific figures invented.
6. **Whisky Casks Outperform / Knight Frank (Feb 2026)** — Knight Frank KFLII is real; 10‑yr rare whisky figure peaked ~373% then declined in 2023–2024. Numbers must be corrected.
7. **Wasting asset / CGT (Jan 2026)** — broadly accurate but HMRC's position on cask CGT status was clarified/challenged in 2023; needs nuance.
8. **Most sought-after distilleries (Jan 2026)** — generally factual.
9. **Bonded warehouses (Dec 2025)** — generally factual.
10. **Five whisky regions (Nov 2025)** — generally factual.

## Replacement real stories

Each rewrite keeps the existing `slug` (and image where appropriate) to avoid breaking routes/imports. Titles, dates, excerpts, and content arrays are replaced.

1. **Macallan auction record** → *"The Macallan 1926 Adami Sets £2.1m World Record for a Bottle of Whisky"* (Sotheby's, Nov 2023 — the genuine standing world record). Discusses what record bottle prices signal for cask values.
2. **Whisky tourism** → *"Scotch Whisky Tourism Rebounds Past 2 Million Visitors"* (SWA visitor figures — 2 million+ visitors reported pre-pandemic and recovering; cite SWA Visitor Attraction Survey).
3. **New Speyside distillery** → *"Rosebank Returns: Lowland Icon Reopens After 30 Years"* (Ian Macleod Distillers reopened Rosebank in 2023, first spirit 2023, official opening 2024) — a real, well-documented new-old distillery story relevant to investors.
4. **China tariffs** → *"India–UK Free Trade Agreement Halves Tariff on Scotch Whisky"* (signed May 2025; cuts 150% duty to 75% immediately, to 40% over 10 years — genuine and material for the industry).
5. **Green revolution** → tighten to real facts: SWA Sustainability Strategy and Net Zero by 2040 commitment, Glenmorangie's Deep loch project, Bruichladdich B Corp status, hydrogen trials (Glenfiddich biogas trucks).
6. **Knight Frank KFLII** → correct numbers: rare whisky returned ~280–322% over 10 years per KFLII 2024 and was the leader for most of the 2010s but slipped in 2023; reframe honestly as a long-term outperformer with recent cooling.
7. **CGT / wasting asset** → keep core point but add the 2023 HMRC clarification that the wasting-asset exemption applies to physical casks in bond but cannot be assumed automatically; recommend professional tax advice.
8–10. Light factual tightening only.

## Implementation

- Edit `src/data/articles.ts` only.
- Preserve all `slug` values, `image` imports, and the `Article` interface.
- Update `title`, `date`, `excerpt`, and `content` paragraphs for items 1–7.
- Light copy-edits for items 8–10 where needed.
- No component, route, or image-asset changes required.
- After edits, spot-check `/news`, `/news/:slug`, and `/portal/news` render correctly (titles, sorting still works because dates remain in "Month YYYY" format).

## Out of scope

- No new images, no schema changes, no new routes.
- No changes to homepage news carousel logic (it reads the same data).
