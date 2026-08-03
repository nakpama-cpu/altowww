# Match order lines to the invoice cask format

Orders in the portal currently show each line as "6 × Glen Mhor" with a single grey spec line in the old order ("Barrel 200L · Ex-Bourbon · 63.2% ABV · 2019"). Invoices already use one shared formatter, so orders should read the same way.

## What changes

Each order line becomes:

```text
6 × Glen Mhor New Make Whisky Cask          £24,975.00
2019 · Ex-Bourbon Barrel 200L · ABV 63.2% Approx
Distilled at Glen Mhor Distillery
```

- Title uses the distillery name plus "New Make Whisky Cask" (under 3 years old) or "Whisky Cask" (3 years or over), same rule as invoices.
- First detail line: year, then wood + cask type + litres coupled together, then ABV.
- Second detail line: "Distilled at [Distillery] Distillery".
- Quantity prefix, price on the right, and all other card styling stay exactly as they are.

## Technical detail

- `src/pages/portal/Orders.tsx`: import `formatInvoiceLine` from `@/lib/invoiceFormat` and use its `title`, `specLine` and `distilledLine` in the expanded item block (lines ~346-358) instead of the inline joins.
- The existing query already selects `distillery, spirit, cask_type, wood, abv, vintage_year`; add `spirit_name` to the `invoice_items` select so the formatter behaves identically to the invoice.
- The search/filter helpers further up the file that build searchable text from the same fields stay untouched.

No backend, database or invoice changes.
