import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, Check, X, Loader2 } from "lucide-react";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invoice-access`;

type Invoice = {
  id: string;
  invoice_number: string;
  payment_reference: string;
  status: string;
  currency: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  discount_code: string | null;
  issued_at: string;
  due_at: string;
  client_confirmed_at: string | null;
  client_note: string | null;
  paid_at: string | null;
  confirmation_token: string;
  bill_to: { name?: string; email?: string };
};

const gbp = (n: number) =>
  `£${Number(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STATUSES = ["all", "awaiting_payment", "client_confirmed", "paid", "cancelled", "expired"] as const;

const badgeClass = (status: string) => {
  switch (status) {
    case "paid": return "bg-primary/10 border-primary/30 text-primary";
    case "client_confirmed": return "bg-amber-500/10 border-amber-500/30 text-amber-700";
    case "cancelled":
    case "expired": return "bg-destructive/10 border-destructive/30 text-destructive";
    default: return "bg-muted border-border text-muted-foreground";
  }
};

export default function AdminInvoices() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("all");
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Could not load invoices", description: error.message, variant: "destructive" });
    setInvoices((data as unknown as Invoice[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const act = async (id: string, action: "paid" | "cancel") => {
    setBusy(id);
    const { error } = await supabase.rpc(
      action === "paid" ? "mark_invoice_paid" : "cancel_invoice",
      { _invoice_id: id },
    );
    setBusy(null);
    if (error) {
      toast({ title: "Action failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: action === "paid" ? "Invoice marked as paid" : "Invoice cancelled" });
    load();
  };

  const rows = invoices.filter((i) => filter === "all" || i.status === filter);

  return (
    <div>
      <h1 className="display-heading text-4xl mb-2">Invoices</h1>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Bank transfer invoices raised at checkout. Mark an invoice as paid once funds have cleared.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-body text-[10px] uppercase tracking-[0.2em] px-3 py-2 border transition-colors ${
              filter === s ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 font-body text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-muted/20 border border-border p-10 text-center font-body text-sm text-muted-foreground">
          No invoices yet.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((inv) => (
            <div key={inv.id} className="bg-muted/20 border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="display-heading text-xl">{inv.invoice_number}</span>
                    <span className={`font-body text-[9px] uppercase tracking-[0.2em] border px-2 py-0.5 ${badgeClass(inv.status)}`}>
                      {inv.status.replace("_", " ")}
                    </span>
                  </div>
                  <div className="font-body text-sm text-muted-foreground mt-1">
                    {inv.bill_to?.name} · {inv.bill_to?.email}
                  </div>
                  <div className="font-body text-xs text-muted-foreground mt-1">
                    Ref {inv.payment_reference} · Issued {new Date(inv.issued_at).toLocaleDateString("en-GB")} · Due{" "}
                    {new Date(inv.due_at).toLocaleDateString("en-GB")}
                    {inv.discount_code ? ` · Code ${inv.discount_code}` : ""}
                  </div>
                  {inv.client_confirmed_at && (
                    <div className="font-body text-xs text-amber-700 mt-1">
                      Client confirmed payment {new Date(inv.client_confirmed_at).toLocaleString("en-GB")}
                      {inv.client_note ? ` — “${inv.client_note}”` : ""}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="display-heading text-2xl text-primary">{gbp(inv.total)}</div>
                  <div className="flex items-center gap-2 mt-2 justify-end flex-wrap">
                    <a
                      href={`${FN_URL}?token=${inv.confirmation_token}`}
                      className="inline-flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.2em] border border-border px-3 py-2 hover:border-primary transition-colors"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </a>
                    {inv.status !== "paid" && inv.status !== "cancelled" && (
                      <>
                        <button
                          onClick={() => act(inv.id, "paid")}
                          disabled={busy === inv.id}
                          className="inline-flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.2em] bg-primary text-primary-foreground px-3 py-2 hover:opacity-90 disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" /> Mark paid
                        </button>
                        <button
                          onClick={() => act(inv.id, "cancel")}
                          disabled={busy === inv.id}
                          className="inline-flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.2em] border border-border px-3 py-2 hover:border-destructive hover:text-destructive disabled:opacity-50"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
