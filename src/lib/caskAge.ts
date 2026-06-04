// Compute a cask's age in whole years from its fill date.
// Increments on each anniversary of the fill date.
export function computeCaskAge(
  fillDate: string | null | undefined,
  fallback?: number | null
): number | null {
  if (!fillDate) return fallback ?? null;
  const fill = new Date(fillDate);
  if (isNaN(fill.getTime())) return fallback ?? null;
  const now = new Date();
  let age = now.getFullYear() - fill.getFullYear();
  const m = now.getMonth() - fill.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < fill.getDate())) age--;
  return age < 0 ? 0 : age;
}
