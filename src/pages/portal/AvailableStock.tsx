import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw, LayoutGrid, Table2, ChevronDown, ExternalLink, Check } from "lucide-react";
import { computeCaskAge } from "@/lib/caskAge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type LinkItem = { title?: string; name?: string; url?: string };


type Cask = {
  id: string;
  cask_number: string;
  spirit: string;
  cask_type: string | null;
  fill_date: string | null;
  abv: number | null;
  ola_litres: number | null;
  rla_litres: number | null;
  age_years: number | null;
  list_price: number | null;
  currency: string;
  description: string | null;
  hero_image_url: string | null;
  created_at: string;
  distilleries: {
    name: string;
    region: string | null;
    country: string | null;
    about: string | null;
    image_url: string | null;
    founded_by: string | null;
    founded_year: number | null;
    famous_for: string | null;
    region_character: string | null;
    annual_production: string | null;
    export_markets: string | null;
    owner: string | null;
    website_url: string | null;
    visitor_centre: string | null;
    news: LinkItem[] | null;
    awards: LinkItem[] | null;
  } | null;
};

export default function AvailableStock() {
  const { profile } = useAuth();
  const cart = useCart();
  const { toast } = useToast();
  const [buyCask, setBuyCask] = useState<Cask | null>(null);
  const [buyQty, setBuyQty] = useState<string>("1");

  const [casks, setCasks] = useState<Cask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterDistillery, setFilterDistillery] = useState("All");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [infoCask, setInfoCask] = useState<Cask | null>(null);
  const discount = Number(profile?.client_discount_pct ?? 0);

  const suggestions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [] as { label: string; field: string; value: string }[];
    const seen = new Set<string>();
    const out: { label: string; field: string; value: string }[] = [];
    const add = (field: string, value: string | null | undefined) => {
      if (!value) return;
      const v = String(value);
      if (!v.toLowerCase().includes(q)) return;
      const key = `${field}::${v.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ label: field, field, value: v });
    };
    for (const c of casks) {
      add("Distillery", c.distilleries?.name);
      add("Cask #", c.cask_number);
      add("Spirit", c.spirit);
      add("Cask Type", c.cask_type);
      add("Region", c.distilleries?.region);
      if (out.length > 30) break;
    }
    return out.slice(0, 8);
  }, [casks, search]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("casks")
        .select("id, cask_number, spirit, cask_type, fill_date, abv, ola_litres, rla_litres, age_years, list_price, currency, description, hero_image_url, created_at, distilleries(name, region, country, about, image_url, founded_by, founded_year, famous_for, region_character, annual_production, export_markets, owner, website_url, visitor_centre, news, awards)")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      if (error) toast({ title: "Could not load stock", description: error.message, variant: "destructive" });
      setCasks((data ?? []) as any);
      setLoading(false);
    })();
  }, [toast]);

  const distilleries = useMemo(
    () => Array.from(new Set(casks.map((c) => c.distilleries?.name).filter(Boolean))),
    [casks]
  );

  const priceFor = (list: number | null) => {
    if (!list) return null;
    return discount > 0 ? list * (1 - discount / 100) : list;
  };

  const openBuy = (c: Cask) => {
    if (!c.list_price) {
      toast({ title: "No price set", description: "This cask is not yet priced.", variant: "destructive" });
      return;
    }
    setBuyCask(c);
    setBuyQty("1");
  };

  const confirmAddToCart = () => {
    if (!buyCask) return;
    const qty = Math.max(1, Math.floor(Number(buyQty) || 1));
    const unit = priceFor(buyCask.list_price);
    if (unit == null) return;
    cart.add({
      cask_id: buyCask.id,
      cask_number: buyCask.cask_number,
      distillery: buyCask.distilleries?.name ?? "",
      spirit: buyCask.spirit,
      list_price: Number(buyCask.list_price),
      unit_price: Number(unit),
      currency: buyCask.currency,
      hero_image_url: buyCask.hero_image_url,
      quantity: qty,
    });
    toast({ title: "Added to cart", description: `${qty} × Cask #${buyCask.cask_number}` });
    setBuyCask(null);
  };


  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const min = filterMinPrice ? Number(filterMinPrice) : null;
    const max = filterMaxPrice ? Number(filterMaxPrice) : null;
    const result = casks.filter((c) => {
      const d = c.distilleries?.name ?? "";
      const effectivePrice = priceFor(c.list_price);
      const matchesSearch =
        !q ||
        c.cask_number.toLowerCase().includes(q) ||
        d.toLowerCase().includes(q) ||
        c.spirit.toLowerCase().includes(q) ||
        (c.cask_type ?? "").toLowerCase().includes(q) ||
        (c.distilleries?.region ?? "").toLowerCase().includes(q);
      const matchesDistillery = filterDistillery === "All" || d === filterDistillery;
      const matchesMin = min === null || (effectivePrice !== null && effectivePrice >= min);
      const matchesMax = max === null || (effectivePrice !== null && effectivePrice <= max);
      return matchesSearch && matchesDistillery && matchesMin && matchesMax;
    });

    const sorted = [...result];
    const num = (v: any) => (v === null || v === undefined ? -Infinity : Number(v));
    const date = (v: any) => (v ? new Date(v).getTime() : 0);
    switch (sortBy) {
      case "newest": sorted.sort((a, b) => date(b.created_at) - date(a.created_at)); break;
      case "oldest": sorted.sort((a, b) => date(a.created_at) - date(b.created_at)); break;
      case "price_high": sorted.sort((a, b) => num(priceFor(b.list_price)) - num(priceFor(a.list_price))); break;
      case "price_low": sorted.sort((a, b) => num(priceFor(a.list_price)) - num(priceFor(b.list_price))); break;
      case "age_high": sorted.sort((a, b) => num(computeCaskAge(b.fill_date, b.age_years)) - num(computeCaskAge(a.fill_date, a.age_years))); break;
      case "age_low": sorted.sort((a, b) => num(computeCaskAge(a.fill_date, a.age_years)) - num(computeCaskAge(b.fill_date, b.age_years))); break;
      case "abv_high": sorted.sort((a, b) => num(b.abv) - num(a.abv)); break;
      case "abv_low": sorted.sort((a, b) => num(a.abv) - num(b.abv)); break;
      case "rla_high": sorted.sort((a, b) => num(b.rla_litres) - num(a.rla_litres)); break;
      case "rla_low": sorted.sort((a, b) => num(a.rla_litres) - num(b.rla_litres)); break;
      case "fill_new": sorted.sort((a, b) => date(b.fill_date) - date(a.fill_date)); break;
      case "fill_old": sorted.sort((a, b) => date(a.fill_date) - date(b.fill_date)); break;
      case "distillery": sorted.sort((a, b) => (a.distilleries?.name ?? "").localeCompare(b.distilleries?.name ?? "")); break;
      case "spirit": sorted.sort((a, b) => (a.spirit ?? "").localeCompare(b.spirit ?? "")); break;
      case "cask_type": sorted.sort((a, b) => (a.cask_type ?? "").localeCompare(b.cask_type ?? "")); break;
    }
    return sorted;
  }, [casks, search, filterDistillery, filterMinPrice, filterMaxPrice, sortBy]);

  return (
    <div className="max-w-7xl">
      <h1 className="display-heading text-4xl mb-2">Available Stock</h1>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Curated casks ready for purchase.
        {discount > 0 && <span className="text-primary"> Your {discount}% client discount is applied.</span>}
      </p>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-2 lg:gap-3 mb-6 w-full">
        <div className="relative col-span-2 md:col-span-6 lg:col-span-12 min-w-0 md:order-1 lg:order-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search casks…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="pl-9 h-10 rounded-none border-border bg-card font-body text-sm w-full"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-card border border-border max-h-72 overflow-auto shadow-lg">
              {suggestions.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); setSearch(s.value); setShowSuggestions(false); }}
                    className="w-full text-left px-3 py-2 font-body text-sm hover:bg-muted flex items-center justify-between gap-3"
                  >
                    <span>{s.value}</span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative min-w-0 md:col-span-2 lg:col-span-2 md:order-2 lg:order-none">
          <select
            value={filterDistillery}
            onChange={(e) => setFilterDistillery(e.target.value)}
            className="appearance-none w-full h-10 pl-3 pr-9 border border-border bg-card font-body text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="All">Distilleries</option>
            {distilleries.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <div className="relative min-w-0 md:col-span-2 lg:col-span-2 md:order-5 lg:order-none">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full h-10 pl-3 pr-9 border border-border bg-card font-body text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Sort</option>
            <option value="newest">Date Added (Newest)</option>
            <option value="oldest">Date Added (Oldest)</option>
            <option value="price_high">Price (High–Low)</option>
            <option value="price_low">Price (Low–High)</option>
            <option value="age_high">Age (High–Low)</option>
            <option value="age_low">Age (Low–High)</option>
            <option value="abv_high">ABV (High–Low)</option>
            <option value="abv_low">ABV (Low–High)</option>
            <option value="rla_high">RLA (High–Low)</option>
            <option value="rla_low">RLA (Low–High)</option>
            <option value="fill_new">Fill Date (Newest)</option>
            <option value="fill_old">Fill Date (Oldest)</option>
            <option value="distillery">Distillery (A–Z)</option>
            <option value="spirit">Spirit (A–Z)</option>
            <option value="cask_type">Cask Type (A–Z)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <div className="relative md:col-span-2 lg:col-span-2 md:order-3 lg:order-none">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground pointer-events-none z-10">£</span>
          <Input
            type="number"
            min="0"
            step="500"
            placeholder="Min"
            value={filterMinPrice}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") setFilterMinPrice("");
              else if (!v.startsWith("-") && Number(v) >= 0) setFilterMinPrice(v);
            }}
            onKeyDown={(e) => { if (e.key === "-") e.preventDefault(); }}
            className="w-full h-10 rounded-none border-border bg-card font-body text-sm pl-7"
          />
        </div>
        <div className="relative md:col-span-2 lg:col-span-2 md:order-4 lg:order-none">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground pointer-events-none z-10">£</span>
          <Input
            type="number"
            min="0"
            step="500"
            placeholder="Max"
            value={filterMaxPrice}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") setFilterMaxPrice("");
              else if (!v.startsWith("-") && Number(v) >= 0) setFilterMaxPrice(v);
            }}
            onKeyDown={(e) => { if (e.key === "-") e.preventDefault(); }}
            className="w-full h-10 rounded-none border-border bg-card font-body text-sm pl-7"
          />
        </div>
        <button
          onClick={() => { setSearch(""); setFilterDistillery("All"); setFilterMinPrice(""); setFilterMaxPrice(""); setSortBy(""); }}
          className="md:col-span-2 lg:col-span-2 w-full flex items-center justify-center gap-1.5 h-10 px-3 border border-border bg-card font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground md:order-6 lg:order-none"
          title="Clear all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
        <div className="flex border border-border w-full h-10 md:col-span-2 lg:col-span-2 md:order-7 lg:order-none">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex-1 flex items-center justify-center h-full ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
            title="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex-1 flex items-center justify-center h-full ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
            title="Table view"
          >
            <Table2 className="w-4 h-4" />
          </button>
        </div>
      </div>



      {loading ? (
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {casks.length === 0 ? "No casks currently available. Check back soon." : "No casks match your search."}
          </p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => {
            const price = priceFor(c.list_price);
            return (
              <div key={c.id} className="bg-card border border-border overflow-hidden flex flex-col">
                {c.hero_image_url && (
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img src={c.hero_image_url} alt={c.cask_number} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="display-heading text-xl leading-snug mb-1 h-[3.25rem] line-clamp-2">{c.distilleries?.name ?? c.spirit}</h3>
                  <p className="font-body text-xs leading-4 text-muted-foreground mb-4 h-[2rem] line-clamp-2">
                    {(() => { const a = computeCaskAge(c.fill_date, c.age_years); return [c.distilleries?.region, c.cask_type, a != null ? `${a} yrs` : null].filter(Boolean).join(" · "); })()}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                    <Mini label="ABV" v={c.abv ? `${c.abv}%` : "—"} />
                    <Mini label="OLA" v={c.ola_litres ? `${c.ola_litres} L` : "—"} />
                    <Mini label="Filled" v={c.fill_date ? c.fill_date.slice(0, 4) : "—"} />
                  </div>
                  {c.description && (
                    <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-3">{c.description}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setInfoCask(c)}
                    className="self-start mb-4 font-body text-[10px] uppercase tracking-[0.2em] text-primary border border-primary/40 hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                  >
                    More Info
                  </button>
                  <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
                    <div>
                      {price && (
                        <>
                          {discount > 0 && c.list_price && (
                            <div className="font-body text-xs text-muted-foreground line-through">
                              £{Number(c.list_price).toLocaleString()}
                            </div>
                          )}
                          <div className="display-heading text-2xl text-primary">
                            £{Math.round(price).toLocaleString()}
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => addToCart(c)}
                      disabled={cart.has(c.id)}
                      className={`font-body text-xs uppercase tracking-[0.2em] px-5 py-2 transition-opacity flex items-center gap-1.5 ${
                        cart.has(c.id)
                          ? "bg-muted text-muted-foreground cursor-default"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      }`}
                    >
                      {cart.has(c.id) ? (<><Check className="w-3.5 h-3.5" /> In Cart</>) : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border border-border bg-card overflow-auto">
          <table className="w-full text-left font-body text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Cask #</th>
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Distillery</th>
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Spirit</th>
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Type</th>
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Fill Date</th>
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Age</th>
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">ABV</th>
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">OLA</th>
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">RLA</th>
                <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Price</th>
                <th className="pl-4 pr-6 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const price = priceFor(c.list_price);
                return (
                  <tr key={c.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{c.cask_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.distilleries?.name ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.spirit}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.cask_type ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.fill_date ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{(() => { const a = computeCaskAge(c.fill_date, c.age_years); return a != null ? `${a} yrs` : "—"; })()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.abv ? `${c.abv}%` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.ola_litres ? `${c.ola_litres} L` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.rla_litres ? `${c.rla_litres} L` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-primary">
                      {price ? `£${Math.round(price).toLocaleString()}` : "—"}
                    </td>
                    <td className="pl-4 pr-6 py-3 whitespace-nowrap">
                      <button
                        onClick={() => addToCart(c)}
                        disabled={cart.has(c.id)}
                        className={`font-body text-[10px] uppercase tracking-[0.15em] px-3 py-1 transition-opacity ${
                          cart.has(c.id)
                            ? "bg-muted text-muted-foreground cursor-default"
                            : "bg-primary text-primary-foreground hover:opacity-90"
                        }`}
                      >
                        {cart.has(c.id) ? "In Cart" : "Add"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!infoCask} onOpenChange={(o) => !o && setInfoCask(null)}>
        <DialogContent className="max-w-2xl w-[calc(100%-2rem)] h-[85vh] bg-card border-border p-0 overflow-hidden flex flex-col">
          {infoCask?.distilleries?.image_url && (
            <div className="basis-1/3 shrink-0 bg-muted overflow-hidden">
              <img
                src={infoCask.distilleries.image_url}
                alt={infoCask.distilleries.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="px-6 pt-5 pb-6 flex-1 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="display-heading text-3xl text-foreground text-left">
                {infoCask?.distilleries?.name ?? "Distillery"}
              </DialogTitle>
              <DialogDescription className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground text-left">
                {[infoCask?.distilleries?.region, infoCask?.distilleries?.country].filter(Boolean).join(" · ") || "—"}
              </DialogDescription>
            </DialogHeader>
            <div className="w-12 h-px bg-primary/60 my-3" />
            <div className="space-y-5">
              {infoCask?.description && (
                <InfoSection title="Cask Description">
                  <p className="font-body text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                    {infoCask.description}
                  </p>
                </InfoSection>
              )}

              {infoCask?.distilleries && (() => {
                const d = infoCask.distilleries;
                const operatingYears = d.founded_year ? new Date().getFullYear() - d.founded_year : null;
                const facts: [string, React.ReactNode][] = [];
                if (d.founded_by) facts.push(["Founded by", d.founded_by]);
                if (d.founded_year) facts.push(["Founded", `${d.founded_year}${operatingYears ? ` · ${operatingYears} years` : ""}`]);
                if (d.famous_for) facts.push(["Famous for", d.famous_for]);
                if (d.region_character) facts.push(["Region character", d.region_character]);
                if (d.annual_production) facts.push(["Annual production", d.annual_production]);
                if (d.export_markets) facts.push(["Key export markets", d.export_markets]);
                if (d.owner) facts.push(["Owner", d.owner]);
                if (d.visitor_centre) facts.push(["Visitor centre", d.visitor_centre]);
                if (d.website_url) facts.push(["Website", (
                  <a href={d.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                    Visit site <ExternalLink className="w-3 h-3" />
                  </a>
                )]);
                if (facts.length === 0) return null;
                return (
                  <InfoSection title="Distillery">
                    <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                      {facts.map(([label, value], i) => (
                        <div key={i}>
                          <dt className="font-body text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-0.5">{label}</dt>
                          <dd className="font-body text-sm text-foreground/90">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </InfoSection>
                );
              })()}

              {infoCask?.distilleries?.about && (
                <InfoSection title="About">
                  <p className="font-body text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                    {infoCask.distilleries.about}
                  </p>
                </InfoSection>
              )}

              {infoCask?.distilleries?.news && infoCask.distilleries.news.length > 0 && (
                <InfoSection title="In the news">
                  <ul className="font-body text-sm space-y-1.5 list-disc pl-5">
                    {infoCask.distilleries.news.map((n, i) => (
                      <li key={i}>
                        {n.url ? (
                          <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                            {n.title || n.url} <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-foreground/90">{n.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </InfoSection>
              )}

              {infoCask?.distilleries?.awards && infoCask.distilleries.awards.length > 0 && (
                <InfoSection title="Awards">
                  <ul className="font-body text-sm space-y-1.5 list-disc pl-5">
                    {infoCask.distilleries.awards.map((a, i) => (
                      <li key={i}>
                        {a.url ? (
                          <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                            {a.name || a.url} <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-foreground/90">{a.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </InfoSection>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Mini = ({ label, v }: { label: string; v: string }) => (
  <div className="border border-border px-1 py-1.5 text-center min-w-0">
    <div className="font-body text-[8px] uppercase tracking-normal text-muted-foreground">{label}</div>
    <div className="font-body text-[11px] leading-tight mt-0.5 whitespace-nowrap">{v}</div>
  </div>
);

const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h4 className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-2">{title}</h4>
    {children}
  </section>
);
