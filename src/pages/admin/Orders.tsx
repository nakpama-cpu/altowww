import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Order = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  stripe_session_id: string | null;
  created_at: string;
  profiles: { first_name: string; last_name: string; email: string } | null;
  casks: { cask_number: string } | null;
};

export default function AdminOrders() {
  const [rows, setRows] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("orders")
        .select("*, profiles(first_name,last_name,email), casks(cask_number)")
        .order("created_at", { ascending: false });
      setRows((data ?? []) as any);
    })();
  }, []);

  return (
    <div className="max-w-5xl">
      <h1 className="display-heading text-4xl mb-8">Orders</h1>
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="p-3">Date</th><th className="p-3">Buyer</th><th className="p-3">Cask</th>
              <th className="p-3">Amount</th><th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-3">{new Date(o.created_at).toLocaleString()}</td>
                <td className="p-3">{o.profiles?.first_name} {o.profiles?.last_name}<br /><span className="text-xs text-muted-foreground">{o.profiles?.email}</span></td>
                <td className="p-3 font-mono">{o.casks?.cask_number}</td>
                <td className="p-3">{o.currency} {Number(o.amount).toLocaleString()}</td>
                <td className="p-3">{o.status}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground font-body">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
