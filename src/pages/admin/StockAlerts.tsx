import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, PackageX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LOW_STOCK_THRESHOLD } from "@/lib/stock";
import { formatCaskSpec } from "@/lib/pallet";

type Row = {
  id: string;
  spirit: string | null;
  spirit_name: string | null;
  cask_type: string | null;
  cask_size_litres: number | null;
  wood: string | null;
  status: string;
  distilleries: { name: string } | null;
  stock_qty: number;
  reserved_qty: number;
  available: number;
};

export default function AdminStockAlerts() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: l }, { data: stock }] = await Promise.all([
        supabase
          .from("cask_listings")
          .select("id, spirit, spirit_name, cask_type, cask_size_litres, wood, status, distilleries(name)")
          .order("created_at", { ascending: false }),
        supabase.rpc("admin_listing_stock"),
      ]);
      const stockMap = new Map((stock ?? []).map((s: any) => [s.listing_id, s]));
      const mapped = ((l ?? []) as any[]).map((row) => {
        const s: any = stockMap.get(row.id);
        const stock_qty = s?.stock_qty ?? 0;
        const reserved_qty = s?.reserved_qty ?? 0;
        return { ...row, stock_qty, reserved_qty, available: Math.max(0, stock_qty - reserved_qty) } as Row;
      });
      setRows(mapped);
      setLoading(false);
    })();
  }, []);

  const out = rows.filter((r) => r.available === 0);
  const low = rows.filter((r) => r.available > 0 && r.available <= LOW_STOCK_THRESHOLD);

  return (
    <div>
      <h1 className="display-heading text-4xl mb-2">Stock Alerts</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">
        Listings with {LOW_STOCK_THRESHOLD} or fewer casks unreserved. Admins are emailed each time a listing enters low
        stock or sells out.
      </p>

      {loading ? (
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      ) : out.length === 0 && low.length === 0 ? (
        <div className="bg-card border border-border p-10 text-center font-body text-sm text-muted-foreground">
          All listings are comfortably in stock.
        </div>
      ) : (
        <div className="space-y-10">
          <AlertTable
            title="Out of stock"
            icon={<PackageX className="w-4 h-4 text-destructive" />}
            rows={out}
            tone="destructive"
          />
          <AlertTable
            title="Low stock"
            icon={<AlertTriangle className="w-4 h-4 text-primary" />}
            rows={low}
            tone="primary"
          />
        </div>
      )}
    </div>
  );
}

function AlertTable({
  title,
  icon,
  rows,
  tone,
}: {
  title: string;
  icon: React.ReactNode;
  rows: Row[];
  tone: "destructive" | "primary";
}) {
  if (rows.length === 0) return null;
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="font-body text-xs uppercase tracking-[0.25em]">
          {title} <span className="text-muted-foreground">({rows.length})</span>
        </h2>
      </div>
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="p-3">Distillery</th>
              <th className="p-3">Cask</th>
              <th className="p-3">Wood</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Reserved</th>
              <th className="p-3">Available</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3">{r.distilleries?.name ?? r.spirit_name ?? "—"}</td>
                <td className="p-3">{formatCaskSpec(r.cask_type, r.cask_size_litres) ?? "—"}</td>
                <td className="p-3">{r.wood ?? "—"}</td>
                <td className="p-3">{r.stock_qty}</td>
                <td className="p-3">{r.reserved_qty}</td>
                <td className={`p-3 font-medium ${tone === "destructive" ? "text-destructive" : "text-primary"}`}>
                  {r.available}
                </td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 text-right">
                  <Link to="/admin/listings" className="text-xs underline">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
