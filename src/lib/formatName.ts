// Normalize person-name input to Title Case, handling spaces and hyphens.
// e.g. "  jOHN " -> "John", "mary-jane" -> "Mary-Jane", "van der berg" -> "Van Der Berg"
export function formatName(input: string): string {
  if (!input) return "";
  return input
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/(^|[\s\-'])([a-zà-ÿ])/g, (_, sep, ch) => sep + ch.toUpperCase());
}

export function formatEmail(input: string): string {
  return (input ?? "").trim().toLowerCase();
}
