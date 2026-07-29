import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Download, CheckCircle2, Landmark, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invoice-access`;

type InvoiceRow = {
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
  bill_to: { name?: string; email?: string; lines?: string[] };
  client_confirmed_at: string | null;
};

type ItemRow = {
  id: string;
  distillery: string | null;
  spirit: string | null;
  spirit_name: string | null;
  cask_type: string | null;
  wood: string | null;
  abv: number | null;
  vintage_year: number | null;
  quantity: number;
  unit_price: number;
  line_total: number;
};

const gbp = (n: number) =>
  `£${Number(n).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function InvoicePage() {
  const { token = "" } = useParams();
  const [params] = useSearchParams();
  const { toast } = useToast();
  const { clear } = useCart();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [bank, setBank] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNew = params.get("new") === "1";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Invoice not found");
      setInvoice(data.invoice);
      setItems(data.items ?? []);
      setBank(data.bank ?? {});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invoice not found");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (isNew) clear(); }, [isNew]);

  const confirmed = !!invoice?.client_confirmed_at;

  const confirmPayment = async () => {
    setConfirming(true);
    try {
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "confirm", token, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not confirm payment");
      toast({ title: "Thank you", description: "We've been notified and will confirm once funds arrive." });
      await load();
    } catch (e) {
      toast({
        title: "Could not confirm",
        description: e instanceof Error ? e.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setConfirming(false);
    }
  };

  const pdfUrl = useMemo(() => `${FN_URL}?token=${encodeURIComponent(token)}`, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <h1 className="display-heading text-3xl mb-3">Invoice not found</h1>
          <p className="font-body text-sm text-muted-foreground mb-6">
            This invoice link is invalid or has expired. Please contact us and we'll resend it.
          </p>
          <Link to="/portal" className="font-body text-xs uppercase tracking-[0.2em] border border-border px-5 py-2.5">
            Back to portal
          </Link>
        </div>
      </div>
    );
  }

  const bankRows: [string, string][] = [
    ["Account name", bank.accountName],
    ["Bank", bank.bankName],
    ["Sort code", bank.sortCode],
    ["Account number", bank.accountNumber],
    ["IBAN", bank.iban],
    ["BIC / SWIFT", bank.bic],
  ].filter(([, v]) => !!v) as [string, string][];

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="display-heading text-3xl tracking-wide">Alto Whisky</Link>
        </div>

        {isNew && (
          <div className="bg-primary/10 border border-primary/30 p-5 mb-6 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-primary mb-2" />
            <h1 className="display-heading text-2xl mb-1">Your casks are reserved</h1>
            <p className="font-body text-sm text-muted-foreground">
              Invoice {invoice.invoice_number} has also been emailed to you. Please complete your
              transfer by {new Date(invoice.due_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
            </p>
          </div>
        )}

        <div className="bg-surface border border-border p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-border">
            <div>
              <h2 className="display-heading text-3xl">Invoice</h2>
              <p className="font-body text-sm text-muted-foreground mt-1">{invoice.invoice_number}</p>
            </div>
            <a
              href={pdfUrl}
              className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] bg-primary text-primary-foreground px-4 py-2.5 hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 py-6 border-b border-border">
            <div>
              <div className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-2">Invoice to</div>
              <div className="font-body text-sm">{invoice.bill_to?.name}</div>
              {(invoice.bill_to?.lines ?? []).map((l, i) => (
                <div key={i} className="font-body text-xs text-muted-foreground">{l}</div>
              ))}
              <div className="font-body text-xs text-muted-foreground">{invoice.bill_to?.email}</div>
            </div>
            <div className="sm:text-right">
              <div className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-2">Details</div>
              <div className="font-body text-xs text-muted-foreground">
                Issued {new Date(invoice.issued_at).toLocaleDateString("en-GB")}
              </div>
              <div className="font-body text-xs text-muted-foreground">
                Due {new Date(invoice.due_at).toLocaleDateString("en-GB")}
              </div>
              <div className="font-body text-xs mt-2">
                Status: <span className="text-primary uppercase tracking-wider">{invoice.status.replace("_", " ")}</span>
              </div>
            </div>
          </div>

          <div className="py-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-start justify-between gap-4 py-3 border-b border-border">
                <div className="min-w-0">
                  <div className="display-heading text-lg">{it.distillery || it.spirit}</div>
                  <div className="font-body text-xs text-muted-foreground">
                    {[it.cask_type, it.wood, it.abv ? `${it.abv}% ABV` : null, it.vintage_year]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                  <div className="font-body text-xs text-muted-foreground mt-1">
                    {gbp(it.unit_price)} × {it.quantity}
                  </div>
                </div>
                <div className="font-body text-sm whitespace-nowrap">{gbp(it.line_total)}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-1 text-right">
            <div className="font-body text-sm text-muted-foreground">Subtotal {gbp(invoice.subtotal)}</div>
            {invoice.discount_amount > 0 && (
              <div className="font-body text-sm text-primary">
                Discount{invoice.discount_code ? ` (${invoice.discount_code})` : ""} −{gbp(invoice.discount_amount)}
              </div>
            )}
            <div className="display-heading text-2xl text-primary pt-1">Total due {gbp(invoice.total)}</div>
          </div>

          <div className="mt-8 bg-muted/30 border-l-2 border-primary p-5">
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="w-4 h-4 text-primary" />
              <span className="font-body text-[10px] uppercase tracking-[0.25em] text-primary">
                Payment by bank transfer
              </span>
            </div>
            <dl className="space-y-1.5">
              {bankRows.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 font-body text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right">{v}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 font-body text-sm pt-2 border-t border-border mt-2">
                <dt className="text-muted-foreground">Payment reference</dt>
                <dd className="font-semibold tracking-[0.12em]">{invoice.payment_reference}</dd>
              </div>
            </dl>
            <p className="font-body text-[11px] text-muted-foreground mt-3 leading-relaxed">
              Please quote the payment reference on your transfer so we can match it to your order.
              Cask whisky held under bond is not subject to VAT.
            </p>
          </div>

          <div className="mt-8">
            {confirmed ? (
              <div className="flex items-start gap-3 bg-primary/10 border border-primary/30 p-5">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-body text-sm">Payment confirmation received</div>
                  <p className="font-body text-xs text-muted-foreground mt-1">
                    Thank you — our team has been notified and will confirm once the funds clear.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
                  Made the transfer?
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Optional: date sent, sending bank or your own reference"
                  className="w-full bg-transparent border border-border px-3 py-2 font-body text-sm focus:outline-none focus:border-primary"
                />
                <button
                  onClick={confirmPayment}
                  disabled={confirming}
                  className="w-full mt-3 font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {confirming ? "Sending…" : "I've made the payment"}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6">
          {!confirmed && invoice.status !== "paid" && invoice.status !== "cancelled" && (
            <Link
              to="/portal/checkout"
              className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to checkout
            </Link>
          )}
          <Link
            to="/portal"
            className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary"
          >
            Back to portal
          </Link>
        </div>

      </div>
    </div>
  );
}
