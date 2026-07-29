import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invoice-access`;

type Order = {
  id: string;
  invoice_number: string;
  payment_reference: string;
  payment_method: string;
  status: string;
  currency: string;
  total: number;
  discount_code: string | null;
  issued_at: string;
  paid_at: string | null;
  client_confirmed_at: string | null;
  confirmation_token: string;
  bill_to: { name?: string; email?: string } | null;
  invoice_items: { id: string; distillery: string | null; spirit: string | null; quantity: number }[];
};

const money = (currency: string, n: number) =>
  `${currency === "GBP" ? "£" : `${currency} `}${Number(n).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusLabel = (s: string) =>
  s === "paid" ? "Paid" : s === "client_confirmed" ? "Payment confirmed" : s.replace(/_/g, " ");

export default function AdminOrders() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("invoices")
        .select(
          "id, invoice_number, payment_reference, payment_method, status, currency, total, discount_code, issued_at, paid_at, client_confirmed_at, confirmation_token, bill_to, invoice_items(id, distillery, spirit, quantity)",
        )
        .in("status", ["client_confirmed", "paid"])
        .order("created_at", { ascending: false });
      setRows((data ?? []) as unknown as Order[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="max-w-6xl">
      <h1 className="display-heading text-4xl mb-8">Orders</h1>
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="p-3">Date</th>
              <th className="p-3">Invoice</th>
              <th className="p-3">Buyer</th>
              <th className="p-3">Casks</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="border-t border-border align-top">
                <td className="p-3 whitespace-nowrap">
                  {new Date(o.paid_at ?? o.client_confirmed_at ?? o.issued_at).toLocaleDateString("en-GB")}
                </td>
                <td className="p-3">
                  <span className="font-mono">{o.invoice_number}</span>
                  <div className="text-xs text-muted-foreground">Ref {o.payment_reference}</div>
                </td>
                <td className="p-3">
                  {o.bill_to?.name}
                  <br />
                  <span className="text-xs text-muted-foreground">{o.bill_to?.email}</span>
                </td>
                <td className="p-3">
                  {o.invoice_items?.map((i) => (
                    <div key={i.id} className="text-xs">
                      {i.quantity} × {i.distillery || i.spirit || "Cask"}
                    </div>
                  ))}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {money(o.currency, o.total)}
                  {o.discount_code && (
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {o.discount_code}
                    </div>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap">{o.payment_method === "card" ? "Card" : "Bank transfer"}</td>
                <td className="p-3 whitespace-nowrap">{statusLabel(o.status)}</td>
                <td className="p-3">
                  <a
                    href={`${FN_URL}?token=${o.confirmation_token}&pdf=1`}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-wider hover:text-primary"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </a>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground font-body">
                  No orders yet.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground font-body">
                  Loading orders...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
