import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search, X, FileText, Loader2, LayoutGrid, Table2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

type Row = {
  id: string;
  purchase_price: number;
  purchase_date: string;
  certificate_path: string | null;
  notes: string | null;
  casks: {
    cask_number: string;
    spirit: string;
    cask_type: string | null;
    fill_date: string | null;
    abv: number | null;
    ola_litres: number | null;
    rla_litres: number | null;
    age_years: number | null;
    distilleries: { name: string } | null;
  };
};

export default function MyCasks() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDistillery, setFilterDistillery] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [certViewer, setCertViewer] = useState<{ url: string; title: string; filename: string } | null>(null);
  const [loadingCert, setLoadingCert] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("holdings")
        .select("id, purchase_price, purchase_date, certificate_path, notes, casks(cask_number, spirit, cask_type, fill_date, abv, ola_litres, rla_litres, age_years, distilleries(name))")
        .order("purchase_date", { ascending: false });
      if (error) toast({ title: "Could not load holdings", description: error.message, variant: "destructive" });
      setRows((data ?? []) as any);
      setLoading(false);
    })();
  }, [toast]);

  const distilleries = useMemo(
    () => Array.from(new Set(rows.map((r) => r.casks.distilleries?.name).filter(Boolean))),
    [rows]
  );
  const caskTypes = useMemo(
    () => Array.from(new Set(rows.map((r) => r.casks.cask_type).filter(Boolean))),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows.filter((r) => {
      const c = r.casks;
      const d = c.distilleries?.name ?? "";
      const matchesSearch =
        !q ||
        c.cask_number.toLowerCase().includes(q) ||
        d.toLowerCase().includes(q) ||
        c.spirit.toLowerCase().includes(q) ||
        (c.cask_type ?? "").toLowerCase().includes(q);
      const matchesDistillery = filterDistillery === "All" || d === filterDistillery;
      const matchesType = filterType === "All" || c.cask_type === filterType;
      return matchesSearch && matchesDistillery && matchesType;
    });
  }, [rows, search, filterDistillery, filterType]);

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
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-6 w-full">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search casks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-none border-border bg-card font-body text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <select
            value={filterDistillery}
            onChange={(e) => setFilterDistillery(e.target.value)}
            className="flex-1 lg:flex-none lg:w-44 h-10 px-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-0"
          >
            <option value="All">All Distilleries</option>
            {distilleries.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 lg:flex-none lg:w-44 h-10 px-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-0"
          >
            <option value="All">All Cask Types</option>
            {caskTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="flex border border-border flex-shrink-0">
            <button
              onClick={() => setViewMode("cards")}
              className={`flex items-center justify-center w-10 h-10 ${viewMode === "cards" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center justify-center w-10 h-10 ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
              title="Table view"
            >
              <Table2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <p className="font-body text-sm text-muted-foreground">
            {rows.length === 0 ? "You don't have any holdings yet." : "No casks match your search."}
          </p>
        </div>
      ) : (
        viewMode === "cards" ? (
          <div className="space-y-4">
            {filtered.map((r) => (
              <div key={r.id} className="bg-card border border-border p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Cask #{r.casks.cask_number}</div>
                    <h3 className="display-heading text-2xl">{r.casks.distilleries?.name ?? "Distillery"}</h3>
                  </div>
                  {r.certificate_path && (
                    <button onClick={() => openCert(r.certificate_path!, `${r.casks.distilleries?.name ?? "Cask"} — ${r.casks.cask_number}`)}
                      disabled={loadingCert}
                      className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] border border-border px-4 py-2 hover:bg-muted disabled:opacity-50">
                      <FileText className="w-3 h-3" /> View Certificate
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                  <Spec label="Spirit" value={r.casks.spirit} />
                  <Spec label="Cask Type" value={r.casks.cask_type} />
                  <Spec label="Fill Date" value={r.casks.fill_date} />
                  <Spec label="Age" value={r.casks.age_years ? `${r.casks.age_years} yrs` : null} />
                  <Spec label="ABV" value={r.casks.abv ? `${r.casks.abv}%` : null} />
                  <Spec label="OLA" value={r.casks.ola_litres ? `${r.casks.ola_litres} L` : null} />
                  <Spec label="RLA" value={r.casks.rla_litres ? `${r.casks.rla_litres} L` : null} />
                  <Spec label="Purchase Price" value={`£${Number(r.purchase_price).toLocaleString()}`} />
                  <Spec label="Purchase Date" value={r.purchase_date} />
                </div>
              </div>
            ))}
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
                  <th className="px-4 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Purchased</th>
                  <th className="pl-4 pr-6 py-3 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.cask_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.distilleries?.name ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.spirit}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.cask_type ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.fill_date ?? "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.age_years ? `${r.casks.age_years} yrs` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.abv ? `${r.casks.abv}%` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.ola_litres ? `${r.casks.ola_litres} L` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.casks.rla_litres ? `${r.casks.rla_litres} L` : "—"}</td>
                    <td className="px-4 py-3 whitespace-nowrap">£{Number(r.purchase_price).toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.purchase_date}</td>
                    <td className="pl-4 pr-6 py-3 whitespace-nowrap">
                      {r.certificate_path ? (
                        <button
                          onClick={() => openCert(r.certificate_path!, `${r.casks.distilleries?.name ?? "Cask"} — ${r.casks.cask_number}`)}
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
          <div className="flex-1 bg-card border border-border overflow-hidden">
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

const Spec = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
  <div>
    <div className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{label}</div>
    <div className="font-body text-sm">{value ?? "—"}</div>
  </div>
);
