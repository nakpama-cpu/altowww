// Single source of truth for how a cask line is described on invoices
// (PDF, on-screen preview and email must all read identically).

export type InvoiceLineLike = {
  distillery?: string | null;
  spirit?: string | null;
  spirit_name?: string | null;
  cask_type?: string | null;
  wood?: string | null;
  abv?: number | null;
  vintage_year?: number | null;
};

export function formatInvoiceLine(it: InvoiceLineLike): {
  title: string;
  specLine: string | null;
  distilledLine: string | null;
} {
  // Age from the vintage year: under 3 years = New Make, 3+ years = Whisky
  const ageYears = it.vintage_year ? new Date().getFullYear() - it.vintage_year : null;
  const productLabel = ageYears !== null && ageYears < 3 ? "New Make Whisky Cask" : "Whisky Cask";
  const explicitName = it.spirit_name && it.spirit_name !== it.distillery ? it.spirit_name : it.spirit;
  const title = it.distillery
    ? `${it.distillery} ${it.vintage_year ? productLabel : (explicitName || productLabel)}`
    : (explicitName || productLabel);

  // Wood + cask type + litres are coupled into one segment (e.g. "Ex-Bourbon Hogshead 250L")
  const caskSegment = [it.wood, it.cask_type].filter(Boolean).join(" ");
  const specLine = [
    it.vintage_year ? `${it.vintage_year}` : null,
    caskSegment || null,
    it.abv ? `ABV ${it.abv}% Approx` : null,
  ].filter(Boolean).join("  ·  ") || null;

  const distilledLine = it.distillery
    ? `Distilled at ${/distillery/i.test(it.distillery) ? it.distillery : `${it.distillery} Distillery`}`
    : null;

  return { title, specLine, distilledLine };
}
