## Plan: Seed fictional casks into Available Stock

Insert 6 fictional cask listings across the existing distilleries so the Available Stock page has content to display. All listings will be `status = 'active'` with a range of ages, cask types, ABVs, and prices.

### Listings to insert

| Distillery | Cask Type | Fill Date | ABV | OLA | RLA | List Price | Stock |
|---|---|---|---|---|---|---|---|
| Glen Mhor (Highland) | First-fill Bourbon Barrel | 2019-04-12 | 63.2% | 195L | 123L | £4,500 | 3 |
| Caol Ila (Islay) | Refill Hogshead | 2017-09-03 | 61.8% | 245L | 152L | £6,200 | 2 |
| Glenrothes (Speyside) | First-fill Oloroso Sherry Butt | 2015-11-20 | 59.4% | 480L | 285L | £12,800 | 2 |
| Ben Nevis (Highland) | Refill Bourbon Hogshead | 2020-02-14 | 63.9% | 240L | 153L | £3,800 | 4 |
| Bunnahabhain (Islay) | First-fill PX Sherry Hogshead | 2018-06-08 | 60.5% | 235L | 142L | £8,500 | 2 |
| Auchentoshan (Lowland) | First-fill Bourbon Barrel | 2021-03-22 | 63.5% | 200L | 127L | £3,200 | 5 |

Each will get a short evocative description (region character, cask influence, expected maturation). `spirit = 'Single Malt Scotch'`, `currency = 'GBP'`, `age_years` left null so it's computed live from `fill_date`.

### Technical

Single `INSERT` via the insert tool into `public.cask_listings`. No schema changes. Tomatin skipped to leave variety; can be added later if you want all 7 covered.
