import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw, LayoutGrid, Table2 } from "lucide-react";


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
  distilleries: { name: string; region: string | null } | null;
};

export default function AvailableStock() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [casks, setCasks] = useState<Cask[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDistillery, setFilterDistillery] = useState("All");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const discount = Number(profile?.client_discount_pct ?? 0);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("casks")
        .select("id, cask_number, spirit, cask_type, fill_date, abv, ola_litres, rla_litres, age_years, list_price, currency, description, hero_image_url, created_at, distilleries(name, region)")
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
      case "age_high": sorted.sort((a, b) => num(b.age_years) - num(a.age_years)); break;
      case "age_low": sorted.sort((a, b) => num(a.age_years) - num(b.age_years)); break;
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
      <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-2 lg:gap-6 mb-6 w-full">
        <div className="relative col-span-2 md:col-span-6 lg:col-span-4 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search casks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-none border-border bg-card font-body text-sm w-full text-center"
          />
        </div>
        <select
          value={filterDistillery}
          onChange={(e) => setFilterDistillery(e.target.value)}
          className="w-full h-10 px-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-0 md:col-span-2 lg:col-span-2 text-center"
        >
          <option value="All">Distilleries</option>
          {distilleries.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full h-10 px-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-0 md:col-span-2 lg:col-span-2 text-center"
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
        <Input
          type="number"
          placeholder="Min £"
          value={filterMinPrice}
          onChange={(e) => setFilterMinPrice(e.target.value)}
          className="w-full h-10 rounded-none border-border bg-card font-body text-sm md:col-span-2 lg:col-span-2 text-center"
        />
        <Input
          type="number"
          placeholder="Max £"
          value={filterMaxPrice}
          onChange={(e) => setFilterMaxPrice(e.target.value)}
          className="w-full h-10 rounded-none border-border bg-card font-body text-sm md:col-span-2 lg:col-span-2 text-center"
        />
        <button
          onClick={() => { setSearch(""); setFilterDistillery("All"); setFilterMinPrice(""); setFilterMaxPrice(""); setSortBy(""); }}
          className="md:col-span-2 lg:col-span-2 w-full flex items-center justify-center gap-1.5 h-10 px-3 border border-border bg-card font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
          title="Clear all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
        <div className="flex border border-border w-full h-10 md:col-span-2 lg:col-span-2">
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
                  <div className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                    Cask #{c.cask_number}
                  </div>
                  <h3 className="display-heading text-xl mb-1">{c.distilleries?.name ?? c.spirit}</h3>
                  <p className="font-body text-xs text-muted-foreground mb-4">
                    {[c.distilleries?.region, c.cask_type, c.age_years ? `${c.age_years} yrs` : null].filter(Boolean).join(" · ")}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                    {c.abv && <Mini label="ABV" v={`${c.abv}%`} />}
                    {c.ola_litres && <Mini label="OLA" v={`${c.ola_litres} L`} />}
                    {c.fill_date && <Mini label="Filled" v={c.fill_date.slice(0, 4)} />}
                  </div>
                  {c.description && (
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3">{c.description}</p>
                  )}
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
                      disabled
                      className="font-body text-xs uppercase tracking-[0.2em] bg-primary/40 text-primary-foreground px-5 py-2 cursor-not-allowed"
                      title="Checkout activates once payments are enabled"
                    >
                      Buy
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
                    <td className="px-4 py-3 whitespace-nowrap">{c.age_years ? `${c.age_years} yrs` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.abv ? `${c.abv}%` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.ola_litres ? `${c.ola_litres} L` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.rla_litres ? `${c.rla_litres} L` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-primary">
                      {price ? `£${Math.round(price).toLocaleString()}` : "—"}
                    </td>
                    <td className="pl-4 pr-6 py-3 whitespace-nowrap">
                      <button
                        disabled
                        className="font-body text-[10px] uppercase tracking-[0.15em] bg-primary/40 text-primary-foreground px-3 py-1 cursor-not-allowed"
                        title="Checkout activates once payments are enabled"
                      >
                        Buy
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

const Mini = ({ label, v }: { label: string; v: string }) => (
  <div className="border border-border p-2 text-center">
    <div className="font-body text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    <div className="font-body text-xs mt-0.5">{v}</div>
  </div>
);
