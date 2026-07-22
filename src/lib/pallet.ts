// Pallet pricing: automatic 7.5% discount per line when the ordered quantity
// is 6 or more, but only if the listing has 6+ casks available in stock.
export const PALLET_MIN_QTY = 6;
export const PALLET_DISCOUNT_PCT = 7.5;

export const palletEligible = (stockAvailable: number | null | undefined) =>
  (stockAvailable ?? 0) >= PALLET_MIN_QTY;

export const palletApplies = (qty: number, stockAvailable: number | null | undefined) =>
  palletEligible(stockAvailable) && qty >= PALLET_MIN_QTY;

export const palletUnitPrice = (listPrice: number) =>
  Math.round(listPrice * (1 - PALLET_DISCOUNT_PCT / 100) * 100) / 100;

// Formatted "Cask" spec: combines shape and size, e.g. "Barrel 200L".
export const formatCaskSpec = (type: string | null | undefined, size: number | null | undefined) => {
  const t = type?.trim();
  const s = size != null ? `${Number(size)}L` : null;
  if (t && s) return `${t} ${s}`;
  return t || s || null;
};
