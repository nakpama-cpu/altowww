import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const downloadCert = async (path: string) => {
    const { data, error } = await supabase.storage.from("cask-certificates").createSignedUrl(path, 60);
    if (error || !data) {
      toast({ title: "Could not generate download link", variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="max-w-7xl">
      <h1 className="display-heading text-4xl mb-2">My Casks</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">Your full holdings with cask specifications and certificates.</p>

      {loading ? (
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <p className="font-body text-sm text-muted-foreground">You don't have any holdings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
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
