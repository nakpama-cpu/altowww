import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Receipt, Banknote, CreditCard, ChevronDown, Search, RotateCcw, Calendar } from "lucide-react";
import InvoiceLoader from "@/components/invoice/InvoiceLoader";
import { Input } from "@/components/ui/input";


type InvoiceItem = {
  id: string;
  distillery: string | null;
  spirit: string | null;
  cask_type: string | null;
  wood: string | null;
  abv: number | null;
  vintage_year: number | null;
  quantity: number;
  line_total: number;
};

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
  invoice_items: InvoiceItem[];
};

const money = (currency: string, n: number) =>
  `${currency === "GBP" ? "£" : `${currency} `}${Number(n).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const statusLabel = (s: string) =>
  s === "paid" ? "Paid" : s === "client_confirmed" ? "Payment confirmed" : s.replace(/_/g, " ");

const statusClass = (s: string) =>
  s === "paid"
    ? "bg-primary/10 border-primary/30 text-primary"
    : "bg-amber-500/10 border-amber-500/30 text-amber-700";

export default function Orders() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Order[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterCaskDetail, setFilterCaskDetail] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterMinAmount, setFilterMinAmount] = useState("");
  const [filterMaxAmount, setFilterMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");


  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("invoices")
        .select(
          "id, invoice_number, payment_reference, payment_method, status, currency, total, discount_code, issued_at, paid_at, client_confirmed_at, confirmation_token, invoice_items(id, distillery, spirit, cask_type, wood, abv, vintage_year, quantity, line_total)",
        )
        .eq("user_id", user.id)
        .in("status", ["client_confirmed", "paid"])
        .order("created_at", { ascending: false });
      setRows((data ?? []) as unknown as Order[]);
      setLoading(false);
    })();
  }, [user]);

  return (
    <div className="max-w-4xl">
      <h1 className="display-heading text-3xl md:text-4xl mb-2">My Orders</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">
        Confirmed purchases, with a copy of the invoice for each order.
      </p>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground font-body border border-border rounded-sm">
          Loading orders...
        </div>
      ) : rows.length === 0 ? (
        <div className="p-12 text-center border border-border rounded-sm bg-muted/20">
          <div className="flex flex-col items-center gap-3">
            <Receipt className="w-8 h-8 text-muted-foreground/50" />
            <p className="text-muted-foreground font-body">No orders yet.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((o) => (
            <div key={o.id} className="border border-border rounded-sm bg-muted/20 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(openId === o.id ? null : o.id)}
                className="w-full text-left flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border bg-muted/40 hover:bg-muted/60 transition-colors"
              >
                <div>
                  <div className="font-mono text-sm">{o.invoice_number}</div>
                  <div className="font-body text-xs text-muted-foreground">
                    {new Date(o.paid_at ?? o.client_confirmed_at ?? o.issued_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {" · Ref "}
                    {o.payment_reference}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border border-border bg-background font-body text-[10px] uppercase tracking-wider text-muted-foreground">
                    {o.payment_method === "card" ? (
                      <CreditCard className="w-3 h-3" />
                    ) : (
                      <Banknote className="w-3 h-3" />
                    )}
                    {o.payment_method === "card" ? "Card" : "Bank transfer"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full border font-body text-[10px] uppercase tracking-wider ${statusClass(o.status)}`}
                  >
                    {statusLabel(o.status)}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${openId === o.id ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              <div className="p-4 space-y-2">
                {o.invoice_items?.map((it) => (
                  <div key={it.id} className="flex justify-between gap-4 font-body text-sm">
                    <span>
                      {it.quantity} × {it.distillery || it.spirit || "Cask"}
                      <span className="block text-xs text-muted-foreground">
                        {[it.cask_type, it.wood, it.abv ? `${it.abv}% ABV` : null, it.vintage_year]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </span>
                    <span>{money(o.currency, it.line_total)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-t border-border">
                <div className="font-body text-sm">
                  Total <span className="font-semibold">{money(o.currency, o.total)}</span>
                  {o.discount_code && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      Code: {o.discount_code}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(openId === o.id ? null : o.id)}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-sm font-body text-xs uppercase tracking-wider hover:bg-muted transition-colors"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  {openId === o.id ? "Hide invoice" : "View invoice"}
                </button>
              </div>

              {openId === o.id && (
                <div className="border-t border-border bg-background p-4">
                  <InvoiceLoader token={o.confirmation_token} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
