## Plan: Rich distillery info modal + populate all current data

### 1. Database migration (`distilleries` table)
Add columns (all optional):
- `image_url` text — distillery banner image
- `founded_by` text
- `founded_year` int
- `famous_for` text
- `region_character` text
- `annual_production` text
- `export_markets` text
- `owner` text
- `website_url` text
- `visitor_centre` text
- `news` jsonb default `'[]'` — array of `{ title, url }`

Convert `awards` from text to jsonb default `'[]'` — array of `{ name, url }`. `about` column stays as-is.

### 2. Modal layout (`AvailableStock.tsx`)
Sections render only when populated; modal scrolls internally:
1. Distillery banner image (16:9, hidden if not set)
2. Distillery name · region · country
3. **Cask Description** — full `description`
4. **Quick facts** two-column grid: Founded by, Founded year (auto "Operating for X years"), Famous for, Region character, Annual production, Key export markets, Owner, Visitor centre, Website link
5. **About** — free-form paragraph
6. **In the news** — bulleted hyperlinks (new tab)
7. **Awards** — bulleted hyperlinks to awarding bodies (new tab; plain text if no URL)

External links use `target="_blank"` + `rel="noopener noreferrer"` with a small external-link icon.

### 3. Admin editing UI (`src/pages/admin/Distilleries.tsx`)
Both Add form and inline Edit row get:
- Text inputs for every new scalar field
- News repeater (Title + URL rows, add/remove)
- Awards repeater (Award name + Organisation URL rows, add/remove)
- Image URL input for the banner

### 4. Populate existing data
Seed all 7 current distilleries (Glen Mhor, Caol Ila, Glenrothes, Ben Nevis, Bunnahabhain, Auchentoshan, Tomatin) with researched, factually grounded values for every new field, including:
- A distillery banner image URL (public, Wikimedia-style image)
- Founder, year, famous for, region character, annual production, export markets, owner, website, visitor centre details
- 2–3 news links each (verified positive press from reputable sources)
- 2–4 awards each, with hyperlinks to the awarding organisation's site (IWSC, World Whiskies Awards, Jim Murray Whisky Bible, San Francisco World Spirits Competition, Scotch Whisky Masters, etc.)
- A richer free-form `about` paragraph

Also expand the 6 available cask `description` fields with fuller tasting/maturation narrative so the modal's Cask Description section reads well.

Where a factual detail is genuinely uncertain, the field is left null rather than fabricated.

### 5. Out of scope
- No automated news/awards fetching — data is seeded once and admin-editable thereafter.
- No changes to MyCasks, table view, carousel, or admin Casks page.
- `logo_url` (carousel logo) is untouched; new `image_url` is a separate banner.
