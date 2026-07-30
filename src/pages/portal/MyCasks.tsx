import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search, X, FileText, Loader2, LayoutGrid, Table2, RotateCcw, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { computeCaskAge } from "@/lib/caskAge";
import { formatCaskSpec } from "@/lib/pallet";
import { regionColor } from "@/lib/regions";
import { displaySpiritName } from "@/lib/utils";

type Row = {
  id: string;
  purchase_price: number;
  purchase_date: string;
  certificate_path: string | null;
  notes: string | null;
  casks: {
    cask_number: string | null;
    spirit: string;
    spirit_name?: string | null;
    cask_type: string | null;
    wood: string | null;
    cask_size_litres: number | null;
    fill_date: string | null;
    abv: number | null;
    ola_litres: number | null;
    rla_litres: number | null;
    age_years: number | null;
    distilleries: { name: string; region: string | null } | null;
  };
};

export default function MyCasks() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [certViewer, setCertViewer] = useState<{ url: string; title: string; filename: string } | null>(null);
  const [loadingCert, setLoadingCert] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [sortBy, setSortBy] = useState<string>("");

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
    for (const r of rows) {
      add("Distillery", r.casks.distilleries?.name);
      add("Cask #", r.casks.cask_number);
      add("Spirit", r.casks.spirit);
      add("Cask Type", r.casks.cask_type);
      if (out.length > 30) break;
    }
    return out.slice(0, 8);
  }, [rows, search]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("holdings")
        .select("id, purchase_price, purchase_date, certificate_path, notes, casks(cask_number, spirit, spirit_name, cask_type, wood, cask_size_litres, fill_date, abv, ola_litres, rla_litres, age_years, distilleries(name, region))")
        .order("purchase_date", { ascending: false });
      if (error) toast({ title: "Could not load holdings", description: error.message, variant: "destructive" });
      setRows((data ?? []) as any);
      setLoading(false);
    })();
  }, [toast]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const result = rows.filter((r) => {
      const c = r.casks;
      const d = c.distilleries?.name ?? "";
      const matchesSearch =
        !q ||
        (c.cask_number ?? "").toLowerCase().includes(q) ||
        d.toLowerCase().includes(q) ||
        c.spirit.toLowerCase().includes(q) ||
        (c.cask_type ?? "").toLowerCase().includes(q);
      return matchesSearch;
    });

    const sorted = [...result];
    const num = (v: any) => (v === null || v === undefined ? -Infinity : Number(v));
    const date = (v: any) => (v ? new Date(v).getTime() : 0);
    switch (sortBy) {
      case "newest": sorted.sort((a, b) => date(b.purchase_date) - date(a.purchase_date)); break;
      case "oldest": sorted.sort((a, b) => date(a.purchase_date) - date(b.purchase_date)); break;
      case "price_high": sorted.sort((a, b) => num(b.purchase_price) - num(a.purchase_price)); break;
      case "price_low": sorted.sort((a, b) => num(a.purchase_price) - num(b.purchase_price)); break;
      case "age_high": sorted.sort((a, b) => num(computeCaskAge(b.casks.fill_date, b.casks.age_years)) - num(computeCaskAge(a.casks.fill_date, a.casks.age_years))); break;
      case "age_low": sorted.sort((a, b) => num(computeCaskAge(a.casks.fill_date, a.casks.age_years)) - num(computeCaskAge(b.casks.fill_date, b.casks.age_years))); break;
      case "abv_high": sorted.sort((a, b) => num(b.casks.abv) - num(a.casks.abv)); break;
      case "abv_low": sorted.sort((a, b) => num(a.casks.abv) - num(b.casks.abv)); break;
      case "rla_high": sorted.sort((a, b) => num(b.casks.rla_litres) - num(a.casks.rla_litres)); break;
      case "rla_low": sorted.sort((a, b) => num(a.casks.rla_litres) - num(b.casks.rla_litres)); break;
      case "distillery": sorted.sort((a, b) => (a.casks.distilleries?.name ?? "").localeCompare(b.casks.distilleries?.name ?? "")); break;
      case "spirit": sorted.sort((a, b) => (a.casks.spirit ?? "").localeCompare(b.casks.spirit ?? "")); break;
      case "cask_type": sorted.sort((a, b) => (a.casks.cask_type ?? "").localeCompare(b.casks.cask_type ?? "")); break;
    }
    return sorted;
  }, [rows, search, sortBy]);

  // Group holdings that are identical except for cask number into a "book" stack.
  const stacks = useMemo(() => {
    const q = search.toLowerCase().trim();
    const sig = (r: Row) => {
      const c = r.casks;
      return [
        c.distilleries?.name ?? "", c.distilleries?.region ?? "", c.spirit ?? "", c.spirit_name ?? "",
        c.cask_type ?? "", c.cask_size_litres ?? "", c.wood ?? "", c.fill_date ?? "",
        c.abv ?? "", c.age_years ?? "", c.ola_litres ?? "", c.rla_litres ?? "",
        r.purchase_price ?? "", r.purchase_date ?? "",
      ].join("|");
    };
    const map = new Map<string, Row[]>();
    const order: string[] = [];
    for (const r of filtered) {
      const k = sig(r);
      if (!map.has(k)) { map.set(k, []); order.push(k); }
      map.get(k)!.push(r);
    }
    return order.map((k) => {
      const units = map.get(k)!;
      let initialIndex = 0;
      if (q) {
        const i = units.findIndex((u) => (u.casks.cask_number ?? "").toLowerCase().includes(q));
        if (i >= 0) initialIndex = i;
      }
      return { key: k, units, initialIndex };
    });
  }, [filtered, search]);

  const openCert = async (path: string, title: string) => {
    setLoadingCert(true);
    const filename = path.split("/").pop() || "certificate.pdf";
    const { data, error } = await supabase.storage
      .from("cask-certificates")
      .createSignedUrl(path, 300);
    setLoadingCert(false);
    if (error || !data) {
      toast({ title: "Could not load certificate", variant: "destructive" });
      return;
    }
    setCertViewer({ url: data.signedUrl, title, filename });
  };

  const downloadFromViewer = async () => {
    if (!certViewer) return;
    try {
      const res = await fetch(certViewer.url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = certViewer.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-7xl">
      <h1 className="display-heading text-4xl mb-2">My Casks</h1>
      <p className="font-body text-sm text-muted-foreground mb-6">Your full holdings with cask specifications and certificates.</p>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 w-full">
        <div className="relative col-span-2 md:col-span-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            type="text"
            placeholder="Search casks…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="pl-9 h-10 rounded-none border-border bg-muted/20 font-body text-sm w-full"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-20 left-0 right-0 top-full mt-1 bg-muted/20 border border-border max-h-72 overflow-auto shadow-lg">
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
        <div className="relative min-w-0 w-full">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full h-10 pl-3 pr-9 border border-border bg-muted/20 font-body text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Sort</option>
            <option value="newest">Purchase Date (Newest)</option>
            <option value="oldest">Purchase Date (Oldest)</option>
            <option value="price_high">Purchase Price (High–Low)</option>
            <option value="price_low">Purchase Price (Low–High)</option>
            <option value="age_high">Age (High–Low)</option>
            <option value="age_low">Age (Low–High)</option>
            <option value="abv_high">ABV (High–Low)</option>
            <option value="abv_low">ABV (Low–High)</option>
            <option value="rla_high">RLA (High–Low)</option>
            <option value="rla_low">RLA (Low–High)</option>
            <option value="distillery">Distillery (A–Z)</option>
            <option value="spirit">Spirit (A–Z)</option>
            <option value="cask_type">Cask Type (A–Z)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        <button
          onClick={() => { setSearch(""); setSortBy(""); }}
          className="w-full flex items-center justify-center gap-1.5 h-10 px-3 border border-border bg-muted/20 font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
          title="Clear all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
        <div className="flex border border-border w-full h-10">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex-1 flex items-center justify-center h-full ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-muted/20 text-muted-foreground hover:text-foreground"}`}
            title="Card view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex-1 flex items-center justify-center h-full ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-muted/20 text-muted-foreground hover:text-foreground"}`}
            title="Table view"
          >
            <Table2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-muted/20 border border-border p-12 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {rows.length === 0 ? "You don't have any holdings yet." : "No casks match your search."}
          </p>
        </div>
      ) : (
        viewMode === "cards" ? (
          <div className="space-y-4">
            {stacks.map((s) => (
              <CaskStack key={s.key} units={s.units} initialIndex={s.initialIndex} openCert={openCert} loadingCert={loadingCert} />
            ))}
          </div>

        ) : (
          <div className="border border-border bg-muted/20 overflow-auto">
            <table className="w-full text-left font-body text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Cask #</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Distillery</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Spirit</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Cask</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Wood</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Fill Date</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Age</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">ABV</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Volume</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Price</th>
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Purchased</th>
                  <th className="pl-4 pr-6 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.cask_number ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.distilleries?.name ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.spirit}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatCaskSpec(r.casks.cask_type, r.casks.cask_size_litres) ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.wood ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.fill_date ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{(() => { const a = computeCaskAge(r.casks.fill_date, r.casks.age_years); return a != null ? `${a} yrs` : "—"; })()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.abv ? `${r.casks.abv}%` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.rla_litres != null ? `${r.casks.rla_litres} L (RLA)` : r.casks.ola_litres != null ? `${r.casks.ola_litres} L (OLA)` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">£{Number(r.purchase_price).toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.purchase_date}</td>
                    <td className="pl-4 pr-6 py-3 whitespace-nowrap">
                      {r.certificate_path ? (
                        <button
                          onClick={() => openCert(r.certificate_path!, `${r.casks.distilleries?.name ?? "Cask"} — ${r.casks.cask_number ?? "TBC"}`)}
                          disabled={loadingCert}
                          className="flex items-center gap-1 font-body text-[10px] uppercase tracking-[0.15em] border border-border px-2 py-1 hover:bg-muted disabled:opacity-50"
                        >
                          <FileText className="w-3 h-3" /> View
                        </button>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {certViewer && (
        <div className="fixed inset-0 z-50 bg-secondary/95 backdrop-blur-sm flex flex-col p-4 md:p-8">
          <div className="flex items-center justify-between mb-4 text-secondary-foreground">
            <div>
              <div className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mb-1">Cask Certificate</div>
              <h2 className="display-heading text-2xl">{certViewer.title}</h2>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={downloadFromViewer}
                className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-4 py-2 hover:opacity-90">
                <Download className="w-3 h-3" /> Download
              </button>
              <button onClick={() => setCertViewer(null)}
                className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] border border-secondary-foreground/30 text-secondary-foreground px-4 py-2 hover:bg-secondary-foreground/10">
                <X className="w-3 h-3" /> Close
              </button>
            </div>
          </div>
          <div className="flex-1 bg-muted/20 border border-border overflow-hidden">
            <iframe src={certViewer.url} title="Cask certificate" className="w-full h-full" />
          </div>
        </div>
      )}

      {loadingCert && !certViewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/60 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

const SpecBox = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="group/spec border border-border/60 bg-surface/60 backdrop-blur-sm px-3 py-2.5 min-h-[64px] flex flex-col justify-start gap-1 min-w-0 transition-all duration-200 hover:bg-surface/90 hover:border-border hover:-translate-y-[1px]">
    <div className="font-body text-[9px] uppercase tracking-[0.2em] text-muted-foreground/70 leading-tight break-words">{label}</div>
    <div className="font-body text-[13px] text-foreground font-medium leading-snug break-words min-w-0" title={value != null ? String(value) : undefined}>{value ?? "—"}</div>
  </div>
);

function CaskCard({ r, openCert, loadingCert }: { r: Row; openCert: (path: string, title: string) => void; loadingCert: boolean }) {
  const accent = regionColor(r.casks.distilleries?.region);
  return (
    <div
      className="relative overflow-hidden border border-border/70 bg-surface/70 backdrop-blur-md p-6 md:p-8 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.18)]"
    >
      {/* Region gradient edge */}
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-1 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${accent}, transparent)` }}
      />
      {/* Soft region glow */}
      <div
        aria-hidden
        className="absolute -left-16 -top-16 w-52 h-52 rounded-full pointer-events-none opacity-[0.09] blur-2xl"
        style={{ backgroundColor: accent }}
      />

      <div className="relative flex flex-wrap items-start justify-between gap-4 mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="font-body text-[10px] uppercase tracking-[0.28em] text-primary">Cask #{r.casks.cask_number ?? "TBC"}</span>
            <span aria-hidden className="h-px w-8 bg-border" />
          </div>
          <h3 className="display-heading text-2xl md:text-[1.75rem] leading-tight mt-1.5">{r.casks.distilleries?.name ?? "Distillery"}</h3>
        </div>
        {r.certificate_path && (
          <button onClick={() => openCert(r.certificate_path!, `${r.casks.distilleries?.name ?? "Cask"} — ${r.casks.cask_number ?? "TBC"}`)}
            disabled={loadingCert}
            className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] border border-border/70 bg-surface/50 backdrop-blur-sm text-muted-foreground px-4 py-2.5 transition-all duration-200 hover:text-primary hover:border-primary/40 hover:bg-surface disabled:opacity-50">
            <FileText className="w-3 h-3" /> View Certificate
          </button>
        )}
      </div>

      {r.casks.fill_date && (() => {
        const filled = new Date(r.casks.fill_date).getTime();
        const now = Date.now();
        const targetYears = 12;
        const elapsedYears = (now - filled) / (365.25 * 24 * 3600 * 1000);
        const pct = Math.max(0, Math.min(100, (elapsedYears / targetYears) * 100));
        return (
          <div className="relative mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-body text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70">Maturation</span>
              <span className="font-body text-[10px] text-muted-foreground tabular-nums">{elapsedYears.toFixed(1)} / {targetYears} yrs</span>
            </div>
            <div className="h-[3px] w-full bg-muted/50 overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(to right, ${accent}, hsl(var(--primary)))`,
                  boxShadow: `0 0 8px 0 hsl(var(--primary) / 0.5)`,
                }}
              />
            </div>
          </div>
        );
      })()}

      <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <SpecBox label="Region" value={r.casks.distilleries?.region} />
        <SpecBox label="Cask" value={formatCaskSpec(r.casks.cask_type, r.casks.cask_size_litres)} />
        <SpecBox label="Wood" value={r.casks.wood} />
        <SpecBox label="Spirit Name" value={displaySpiritName(r.casks)} />
        <SpecBox label="ABV" value={r.casks.abv != null ? `${r.casks.abv}%` : null} />
        {(() => { const a = computeCaskAge(r.casks.fill_date, r.casks.age_years); return <SpecBox label="Age" value={a != null ? `${a} yrs` : null} />; })()}
        <SpecBox label="Fill Date" value={r.casks.fill_date} />
        {r.casks.rla_litres != null
          ? <SpecBox label="RLA" value={`${r.casks.rla_litres} L`} />
          : <SpecBox label="OLA" value={r.casks.ola_litres != null ? `${r.casks.ola_litres} L` : null} />}
        <SpecBox label="Purchase Price" value={`£${Number(r.purchase_price).toLocaleString()}`} />
        <SpecBox label="Purchase Date" value={r.purchase_date} />
      </div>
    </div>
  );
}


function CaskStack({ units, initialIndex, openCert, loadingCert }: { units: Row[]; initialIndex: number; openCert: (path: string, title: string) => void; loadingCert: boolean }) {
  const [index, setIndex] = useState(initialIndex);
  const [turning, setTurning] = useState<null | "next" | "prev">(null);

  useEffect(() => { setIndex(initialIndex); }, [initialIndex, units.length]);

  const total = units.length;
  const safeIndex = Math.min(index, total - 1);
  const current = units[safeIndex];
  const accent = regionColor(current.casks.distilleries?.region);

  if (total === 1) {
    return <CaskCard r={current} openCert={openCert} loadingCert={loadingCert} />;
  }

  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const go = (dir: "next" | "prev") => {
    if (turning) return;
    const next = dir === "next" ? (safeIndex + 1) % total : (safeIndex - 1 + total) % total;
    if (reduced) { setIndex(next); return; }
    setTurning(dir);
    window.setTimeout(() => { setIndex(next); setTurning(null); }, 320);
  };

  const edges = Math.min(total - 1, 3);

  // Swipe / drag to flip pages
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [drag, setDrag] = useState(0);

  const onPointerDown = (e: React.PointerEvent) => {
    if (turning) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, textarea, select")) return;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) { dragStart.current = null; setDrag(0); return; }
    setDrag(dx);
  };
  const endDrag = () => {
    if (!dragStart.current) return;
    const dx = drag;
    dragStart.current = null;
    setDrag(0);
    if (Math.abs(dx) > 60) go(dx < 0 ? "next" : "prev");
  };

  return (
    <div
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go("next"); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go("prev"); }
      }}
      className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-ring touch-pan-y select-none group"
      style={{ marginBottom: edges * 8 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}
    >
      {/* Frosted-glass stack edges (pages behind) */}
      {Array.from({ length: edges }).map((_, i) => {
        const depth = edges - i; // 1 is nearest to front, larger is further back
        const isBack = depth === edges;
        return (
          <div
            key={i}
            aria-hidden
            className={`
              absolute inset-x-0 top-0 bottom-0 pointer-events-none border border-border border-l-4
              ${isBack ? "bg-muted/10 backdrop-blur-[1px]" : "bg-surface/40 backdrop-blur-sm"}
            `}
            style={{
              borderLeftColor: accent,
              transform: `translate(${depth * 3}px, ${depth * 8}px) scale(${1 - depth * 0.015})`,
              opacity: isBack ? 0.35 : 0.65,
              zIndex: 0,
              boxShadow: isBack ? "0 12px 28px -12px rgba(0,0,0,0.08)" : "0 8px 20px -8px rgba(0,0,0,0.06)",
            }}
          />
        );
      })}

      <div
        className={`relative z-10 origin-left ${drag ? "" : "transition-[transform,opacity] duration-[320ms] ease-[cubic-bezier(0.23,1,0.32,1)]"}`}
        style={
          turning
            ? {
                transform: turning === "next"
                  ? "translateX(-6%) translateY(-12px) rotate(-3deg) scale(0.97)"
                  : "translateX(6%) translateY(-12px) rotate(3deg) scale(0.97)",
                opacity: 0,
              }
            : drag
              ? {
                  transform: `translateX(${drag * 0.5}px) translateY(${-Math.min(Math.abs(drag) * 0.08, 10)}px) rotate(${drag * 0.015}deg) scale(${1 - Math.min(Math.abs(drag) * 0.00015, 0.03)})`,
                  opacity: Math.max(0.45, 1 - Math.abs(drag) / 360),
                }
              : { transform: "none", opacity: 1 }
        }
      >
        <div className="shadow-[0_12px_32px_-12px_rgba(0,0,0,0.08)]">
          <CaskCard r={current} openCert={openCert} loadingCert={loadingCert} />
        </div>
      </div>


      <div className="relative z-10 -mt-px flex items-center justify-between gap-3 bg-surface/80 backdrop-blur-sm border border-t-0 border-border border-l-4 px-4 py-2.5"
        style={{ borderLeftColor: accent }}>
        <button
          type="button"
          onClick={() => go("prev")}
          className="flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Previous cask"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            {units.map((u, i) => (
              <button
                key={u.id}
                type="button"
                aria-label={`Cask ${i + 1}`}
                onClick={() => setIndex(i)}
                className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                style={{
                  backgroundColor: i === safeIndex ? accent : "hsl(var(--muted-foreground))",
                  opacity: i === safeIndex ? 1 : 0.25,
                  transform: i === safeIndex ? "scale(1.3)" : "scale(1)",
                }}
              />
            ))}
          </div>
          <span className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
            {safeIndex + 1} / {total} Casks
          </span>
        </div>

        <button
          type="button"
          onClick={() => go("next")}
          className="flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Next cask"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Swipe hint */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[10px] font-body uppercase tracking-[0.2em] text-muted-foreground/60 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{ top: "calc(100% + 8px)" }}
      >
        <ChevronLeft className="w-3 h-3" />
        <span>Swipe or drag to flip</span>
        <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  );
}

