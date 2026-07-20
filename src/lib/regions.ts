// Whisky region → accent colour (HSL for token compatibility). Used as a slim
// left border on cask cards for quick visual differentiation.
export const REGION_COLOR: Record<string, string> = {
  Speyside: "hsl(28 65% 45%)",     // amber
  Islay: "hsl(200 45% 30%)",       // deep sea blue (peat/sea)
  Highland: "hsl(140 30% 35%)",    // heather green
  Lowland: "hsl(85 35% 45%)",      // pale green
  Campbeltown: "hsl(15 55% 40%)",  // salt-copper
  Islands: "hsl(220 35% 40%)",     // slate
};

export function regionColor(region?: string | null): string {
  if (!region) return "hsl(var(--primary))";
  return REGION_COLOR[region] ?? "hsl(var(--primary))";
}
