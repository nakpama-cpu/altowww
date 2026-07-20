import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Receipt } from "lucide-react";

type Order = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  discount_code: string | null;
  created_at: string;
  casks: { cask_number: string | null } | null;
  cask_listings: { spirit: string; distilleries: { name: string } | null } | null;
};

export default function Orders() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, amount, currency, status, discount_code, created_at, casks(cask_number), cask_listings(spirit, distilleries(name))")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });
      setRows((data ?? []) as any);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="max-w-4xl">
      <h1 className="display-heading text-3xl md:text-4xl mb-2">My Orders</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">
        View your cask purchases and their current status.
      </p>

      <div className="bg-muted/20 border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <th className="p-4">Date</th>
                <th className="p-4">Cask</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground font-body">
                    Loading orders...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Receipt className="w-8 h-8 text-muted-foreground/50" />
                      <p className="text-muted-foreground font-body">No orders yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((o) => (
                  <tr key={o.id} className="border-t border-border">
                    <td className="p-4 font-body">
                      {new Date(o.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      {o.casks?.cask_number ? (
                        <span className="font-mono">{o.casks.cask_number}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Pending · {o.cask_listings?.distilleries?.name ?? o.cask_listings?.spirit ?? "—"}
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-body">
                      {o.currency} {Number(o.amount).toLocaleString()}
                      {o.discount_code && (
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                          Code: {o.discount_code}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full font-body text-[10px] uppercase tracking-wider bg-muted text-muted-foreground">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
