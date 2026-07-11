## Cask card — top half redesign

Replace the current 3-tile mini row (ABV / OLA / Filled) with a richer, fully-legible stats block showing the six details you named, in priority order:

1. Age
2. Wood
3. Cask Type
4. Filled
5. OLA
6. Region

### Layout

A 3-column × 2-row grid of stat cells (mobile stays 3 cols; each cell grows in height as needed — no truncation, no ellipsis).

```text
┌───────────┬───────────┬───────────┐
│ AGE       │ WOOD      │ CASK TYPE │
│ 12 yrs    │ American  │ Ex-Bourbon│
│           │ Oak       │ Barrel    │
├───────────┼───────────┼───────────┤
│ FILLED    │ OLA       │ REGION    │
│ 22 Mar    │ 198 L     │ Speyside  │
│ 2013      │           │           │
└───────────┴───────────┴───────────┘
```

Each cell:
- Small uppercase label on top (wraps if needed, no truncation)
- Value below in body size, allowed to wrap onto 2–3 lines
- Consistent min-height so the grid stays tidy; cells auto-grow together per row (`grid-auto-rows: 1fr`)
- Left-aligned text (easier to read multi-word values like "American Oak", "Ex-Bourbon Barrel", "Speyside")
- Thin border, subtle bg, tighter padding than today

Also remove the redundant "region · type · age" summary line above the grid (line 347–349), since those facts now live in the grid.

### Data mapping

| Cell      | Source                                                          |
| --------- | --------------------------------------------------------------- |
| Age       | `computeCaskAge(fill_date, age_years)` → "12 yrs" / "—"         |
| Wood      | **New** — not in DB today. See open question below.             |
| Cask Type | `cask_type` (e.g. "Ex-Bourbon Barrel")                          |
| Filled    | `fill_date` formatted "22 Mar 2013" (not just year)             |
| OLA       | `ola_litres` → "198 L"                                          |
| Region    | `distilleries.region`                                           |

### Open question — "Wood"

The `casks` table has `cask_type` (e.g. "Ex-Bourbon Barrel") but **no separate wood field**. Two options:

- **A. Add a `wood` column** to `casks` (e.g. "American Oak", "European Oak", "Mizunara") — cleanest, needs a migration + admin form field + backfill.
- **B. Derive wood from `cask_type`** with a simple map (Bourbon → American Oak, Sherry/Port → European Oak, etc.) — no schema change, but approximate.

Tell me which you'd like and I'll implement. If A, I'll add the column, grant, expose it in the admin Casks editor, and default existing rows to null (shown as "—").

### Files touched

- `src/pages/portal/AvailableStock.tsx` — new stat-grid component, remove summary line, update card top half. Keep `Mini` for the Buy dialog or replace it there too for consistency.
- (If option A) new migration + `src/pages/admin/Casks.tsx` field.

### Verification

Playwright at 360, 390, 768, 1280 px — screenshot the card and confirm every label and value renders in full with no `…`.
