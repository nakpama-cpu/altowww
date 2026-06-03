import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search, X, FileText, Loader2 } from "lucide-react";
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

  const downloadCert = async (path: string) => {
    const filename = path.split("/").pop() || "certificate.pdf";
    const { data, error } = await supabase.storage
      .from("cask-certificates")
      .createSignedUrl(path, 60, { download: filename });
    if (error || !data) {
      toast({ title: "Could not generate download link", variant: "destructive" });
      return;
    }
    const a = document.createElement("a");
    a.href = data.signedUrl;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="max-w-7xl">
      <h1 className="display-heading text-4xl mb-2">My Casks</h1>
      <p className="font-body text-sm text-muted-foreground mb-6">Your full holdings with cask specifications and certificates.</p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-10 px-3 border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <option value="All">All Cask Types</option>
          {caskTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
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
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="bg-card border border-border p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Cask #{r.casks.cask_number}</div>
                  <h3 className="display-heading text-2xl">{r.casks.distilleries?.name ?? "Distillery"}</h3>
                </div>
                {r.certificate_path && (
                  <button onClick={() => downloadCert(r.certificate_path!)}
                    className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] border border-border px-4 py-2 hover:bg-muted">
                    <Download className="w-3 h-3" /> Certificate
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
