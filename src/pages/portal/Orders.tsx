import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Receipt, Banknote, CreditCard, ChevronDown, Search, RotateCcw, Calendar } from "lucide-react";
import InvoiceLoader from "@/components/invoice/InvoiceLoader";
import { Input } from "@/components/ui/input";
import { formatInvoiceLine } from "@/lib/invoiceFormat";



type InvoiceItem = {
  id: string;
  distillery: string | null;
  spirit: string | null;
  spirit_name: string | null;
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
          "id, invoice_number, payment_reference, payment_method, status, currency, total, discount_code, issued_at, paid_at, client_confirmed_at, confirmation_token, invoice_items(id, distillery, spirit, spirit_name, cask_type, wood, abv, vintage_year, quantity, line_total)",
        )
        .eq("user_id", user.id)
        .in("status", ["client_confirmed", "paid"])
        .order("created_at", { ascending: false });
      setRows((data ?? []) as unknown as Order[]);
      setLoading(false);
    })();
  }, [user]);

  const effectiveDate = (o: Order) => new Date(o.paid_at ?? o.client_confirmed_at ?? o.issued_at);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();
    const caskQ = filterCaskDetail.toLowerCase().trim();
    const minAmount = filterMinAmount ? Number(filterMinAmount) : null;
    const maxAmount = filterMaxAmount ? Number(filterMaxAmount) : null;
    const fromDate = filterDateFrom ? new Date(filterDateFrom) : null;
    const toDate = filterDateTo ? new Date(filterDateTo) : null;

    const result = rows.filter((o) => {
      const orderDate = effectiveDate(o);
      const orderDateStr = orderDate.toISOString().split("T")[0];

      const searchMatch =
        !q ||
        o.invoice_number.toLowerCase().includes(q) ||
        o.payment_reference.toLowerCase().includes(q) ||
        o.invoice_items.some((it) =>
          [it.distillery, it.spirit, it.cask_type, it.wood, it.abv ? `${it.abv}%` : null, it.vintage_year ? String(it.vintage_year) : null]
            .filter(Boolean)
            .some((v) => v!.toLowerCase().includes(q))
        );

      const caskMatch =
        !caskQ ||
        o.invoice_items.some((it) =>
          [it.distillery, it.spirit, it.cask_type, it.wood]
            .filter(Boolean)
            .some((v) => v!.toLowerCase().includes(caskQ))
        );

      const paymentMatch = filterPaymentMethod === "all" || o.payment_method === filterPaymentMethod;
      const statusMatch = filterStatus === "all" || o.status === filterStatus;
      const minMatch = minAmount === null || o.total >= minAmount;
      const maxMatch = maxAmount === null || o.total <= maxAmount;
      const fromMatch = fromDate === null || orderDateStr >= filterDateFrom;
      const toMatch = toDate === null || orderDateStr <= filterDateTo;

      return searchMatch && caskMatch && paymentMatch && statusMatch && minMatch && maxMatch && fromMatch && toMatch;
    });

    return [...result].sort((a, b) => {
      const da = effectiveDate(a).getTime();
      const db = effectiveDate(b).getTime();
      return sortBy === "newest" ? db - da : da - db;
    });
  }, [rows, search, filterCaskDetail, filterPaymentMethod, filterStatus, filterDateFrom, filterDateTo, filterMinAmount, filterMaxAmount, sortBy]);

  return (
    <div className="max-w-4xl">
      <h1 className="display-heading text-3xl md:text-4xl mb-2">My Orders</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">
        Confirmed purchases, with a copy of the invoice for each order.
      </p>

      {/* Filters */}
      {!loading && rows.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <div className="relative col-span-2 md:col-span-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Search invoice number or cask details…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-none border-border field-surface font-body text-sm w-full"
            />
          </div>
          <div className="relative">
            <select
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="appearance-none w-full h-10 pl-3 pr-9 border border-border field-surface font-body text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All payment methods</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank transfer</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none w-full h-10 pl-3 pr-9 border border-border field-surface font-body text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="client_confirmed">Payment confirmed</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              type="date"
              placeholder="From"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="pl-9 h-10 rounded-none border-border field-surface font-body text-sm w-full"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              type="date"
              placeholder="To"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="pl-9 h-10 rounded-none border-border field-surface font-body text-sm w-full"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground pointer-events-none z-10">£</span>
            <Input
              type="number"
              min="0"
              step="500"
              placeholder="Min amount"
              value={filterMinAmount}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || (!v.startsWith("-") && Number(v) >= 0)) setFilterMinAmount(v);
              }}
              onKeyDown={(e) => { if (e.key === "-") e.preventDefault(); }}
              className="w-full h-10 rounded-none border-border field-surface font-body text-sm pl-7"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground pointer-events-none z-10">£</span>
            <Input
              type="number"
              min="0"
              step="500"
              placeholder="Max amount"
              value={filterMaxAmount}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || (!v.startsWith("-") && Number(v) >= 0)) setFilterMaxAmount(v);
              }}
              onKeyDown={(e) => { if (e.key === "-") e.preventDefault(); }}
              className="w-full h-10 rounded-none border-border field-surface font-body text-sm pl-7"
            />
          </div>
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Filter by cask detail (distillery, spirit, type…)"
              value={filterCaskDetail}
              onChange={(e) => setFilterCaskDetail(e.target.value)}
              className="pl-9 h-10 rounded-none border-border field-surface font-body text-sm w-full"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
              className="appearance-none w-full h-10 pl-3 pr-9 border border-border field-surface font-body text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="newest">Most recent first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <button
            onClick={() => {
              setSearch("");
              setFilterCaskDetail("");
              setFilterPaymentMethod("all");
              setFilterStatus("all");
              setFilterDateFrom("");
              setFilterDateTo("");
              setFilterMinAmount("");
              setFilterMaxAmount("");
              setSortBy("newest");
            }}
            className="w-full flex items-center justify-center gap-1.5 h-10 px-3 border border-border field-surface font-body text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
            title="Clear all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-muted-foreground font-body border border-border rounded-sm">
          Loading orders…
        </div>
      ) : rows.length === 0 ? (
        <div className="p-12 text-center rounded-sm glass-card">
          <div className="flex flex-col items-center gap-3">
            <Receipt className="w-8 h-8 text-muted-foreground/50" />
            <p className="text-muted-foreground font-body">No orders yet.</p>
          </div>
        </div>
      ) : filteredRows.length === 0 ? (
        <div className="p-12 text-center rounded-sm glass-card">
          <div className="flex flex-col items-center gap-3">
            <Search className="w-8 h-8 text-muted-foreground/50" />
            <p className="text-muted-foreground font-body">No orders match your search or filters.</p>
            <button
              onClick={() => {
                setSearch("");
                setFilterCaskDetail("");
                setFilterPaymentMethod("all");
                setFilterStatus("all");
                setFilterDateFrom("");
                setFilterDateTo("");
                setFilterMinAmount("");
                setFilterMaxAmount("");
                setSortBy("newest");
              }}
              className="inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.15em] text-primary hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRows.map((o) => (
            <div key={o.id} className="rounded-sm glass-card overflow-hidden">
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
                {o.invoice_items?.map((it) => {
                  const { title, specLine, distilledLine } = formatInvoiceLine(it);
                  return (
                    <div key={it.id} className="flex justify-between gap-4 font-body text-sm">
                      <span>
                        {it.quantity} × {title}
                        {specLine && (
                          <span className="block text-xs text-muted-foreground">{specLine}</span>
                        )}
                        {distilledLine && (
                          <span className="block text-xs text-muted-foreground">{distilledLine}</span>
                        )}
                      </span>
                      <span>{money(o.currency, it.line_total)}</span>
                    </div>
                  );
                })}
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
