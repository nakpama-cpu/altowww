import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw } from "lucide-react";

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
  const [filterType, setFilterType] = useState("All");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");
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
  const caskTypes = useMemo(
    () => Array.from(new Set(casks.map((c) => c.cask_type).filter(Boolean))),
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
      const matchesType = filterType === "All" || c.cask_type === filterType;
      const matchesMin = min === null || (effectivePrice !== null && effectivePrice >= min);
      const matchesMax = max === null || (effectivePrice !== null && effectivePrice <= max);
      return matchesSearch && matchesDistillery && matchesType && matchesMin && matchesMax;
    });

    const sorted = [...result];
    switch (sortBy) {
      case "newest":
        sorted.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime());
        break;
      case "price_high":
        sorted.sort((a, b) => Number(priceFor(b.list_price) ?? 0) - Number(priceFor(a.list_price) ?? 0));
        break;
      case "price_low":
        sorted.sort((a, b) => Number(priceFor(a.list_price) ?? 0) - Number(priceFor(b.list_price) ?? 0));
        break;
      case "distillery":
        sorted.sort((a, b) => (a.distilleries?.name ?? "").localeCompare(b.distilleries?.name ?? ""));
        break;
    }
    return sorted;
  }, [casks, search, filterDistillery, filterType, filterMinPrice, filterMaxPrice, sortBy]);

  return (
    <div className="max-w-7xl">
      <h1 className="display-heading text-4xl mb-2">Available Stock</h1>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Curated casks ready for purchase.
        {discount > 0 && <span className="text-primary"> Your {discount}% client discount is applied.</span>}
      </p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by cask number, distillery, spirit or type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-none border-border bg-card font-body text-sm"
          />
        </div>
        <select
          value={filterDistillery}
          onChange={(e) => setFilterDistillery(e.target.value)}
          className="h-10 px-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="All">All Distilleries</option>
          {distilleries.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-10 px-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_high">Price: High to Low</option>
          <option value="price_low">Price: Low to High</option>
          <option value="distillery">Distillery A–Z</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-10 px-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="All">All Cask Types</option>
          {caskTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min £"
            value={filterMinPrice}
            onChange={(e) => setFilterMinPrice(e.target.value)}
            className="w-28 rounded-none border-border bg-card font-body text-sm"
          />
          <Input
            type="number"
            placeholder="Max £"
            value={filterMaxPrice}
            onChange={(e) => setFilterMaxPrice(e.target.value)}
            className="w-28 rounded-none border-border bg-card font-body text-sm"
          />
        </div>
        <button
          onClick={() => { setSearch(""); setFilterDistillery("All"); setFilterType("All"); setFilterMinPrice(""); setFilterMaxPrice(""); setSortBy("newest"); }}
          className="flex items-center justify-center gap-1.5 h-10 px-3 border border-border bg-card font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground flex-shrink-0"
          title="Clear all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {loading ? (
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {casks.length === 0 ? "No casks currently available. Check back soon." : "No casks match your search."}
          </p>
        </div>
      ) : (
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
