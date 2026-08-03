// Stock level thresholds shared by the portal and admin console.
// Mirrored in the DB trigger public.trg_listing_stock_alert().
export const LOW_STOCK_THRESHOLD = 3;

export type StockState = "ok" | "low" | "out";

export const stockState = (available: number | null | undefined): StockState => {
  const n = Math.max(0, available ?? 0);
  if (n === 0) return "out";
  if (n <= LOW_STOCK_THRESHOLD) return "low";
  return "ok";
};
