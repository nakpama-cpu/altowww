import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, CheckCircle2, Landmark, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import altoLogo from "@/assets/alto-logo.png";

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invoice-access`;

/* Brand palette mirrored from the downloadable PDF */
const NAVY = "#1b2535";
const COPPER = "#b45a1d";
const CREAM = "#f6f4f0";

export type InvoiceRow = {
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

export type InvoiceItemRow = {
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

export function useInvoice(token: string) {
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceRow | null>(null);
  const [items, setItems] = useState<InvoiceItemRow[]>([]);
  const [bank, setBank] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
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
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invoice not found");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  return { loading, invoice, items, bank, error, reload: load };
}

type Props = {
  token: string;
  invoice: InvoiceRow;
  items: InvoiceItemRow[];
  bank: Record<string, string>;
  onConfirmed?: () => void;
};

export default function InvoiceView({ token, invoice, items, bank, onConfirmed }: Props) {
  const { toast } = useToast();
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);

  const confirmed = !!invoice.client_confirmed_at;
  const pdfUrl = useMemo(() => `${FN_URL}?token=${encodeURIComponent(token)}`, [token]);

  const bankRows: [string, string][] = [
    ["Account name", bank.accountName],
    ["Bank", bank.bankName],
    ["Sort code", bank.sortCode],
    ["Account number", bank.accountNumber],
    ["IBAN", bank.iban],
    ["BIC / SWIFT", bank.bic],
  ].filter(([, v]) => !!v) as [string, string][];

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
      onConfirmed?.();
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

  return (
    <div className="border border-border shadow-sm overflow-hidden bg-surface">
      {/* Navy header band with logo — mirrors the PDF */}
      <div className="px-6 sm:px-8 py-6" style={{ backgroundColor: NAVY }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <img src={altoLogo} alt="Alto Whisky" className="h-9 w-auto object-contain" />
          <div className="text-right">
            <div className="font-body text-[10px] uppercase tracking-[0.3em] text-white/60">Invoice</div>
            <div className="display-heading text-2xl text-white">{invoice.invoice_number}</div>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: COPPER, height: 4 }} />

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="font-body text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: COPPER }}>
              Invoice to
            </div>
            <div className="font-body text-sm">{invoice.bill_to?.name}</div>
            {(invoice.bill_to?.lines ?? []).map((l, i) => (
              <div key={i} className="font-body text-xs text-muted-foreground">{l}</div>
            ))}
            <div className="font-body text-xs text-muted-foreground">{invoice.bill_to?.email}</div>
          </div>
          <div className="sm:text-right">
            <div className="font-body text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: COPPER }}>
              Details
            </div>
            <div className="font-body text-xs text-muted-foreground">
              Issued {new Date(invoice.issued_at).toLocaleDateString("en-GB")}
            </div>
            <div className="font-body text-xs text-muted-foreground">
              Due {new Date(invoice.due_at).toLocaleDateString("en-GB")}
            </div>
            <div className="font-body text-xs mt-2">
              Status:{" "}
              <span className="uppercase tracking-wider" style={{ color: COPPER }}>
                {invoice.status.replace("_", " ")}
              </span>
            </div>
            <a
              href={pdfUrl}
              className="inline-flex items-center gap-2 mt-3 font-body text-[10px] uppercase tracking-[0.2em] text-white px-4 py-2.5 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: COPPER }}
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </a>
          </div>
        </div>

        <div className="mt-6 border border-border">
          <div
            className="grid grid-cols-[1fr_48px_96px_104px] gap-3 px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
            style={{ backgroundColor: CREAM }}
          >
            <span>Description</span>
            <span>Qty</span>
            <span>Unit price</span>
            <span className="text-right">Amount</span>
          </div>
          {items.map((it) => {
            const { title, specLine, distilledLine } = formatInvoiceLine(it);
            const listPrice = Number(it.list_price ?? it.unit_price);
            const discounted = listPrice > it.unit_price;
            const listTotal = Math.round(listPrice * it.quantity * 100) / 100;
            return (
              <div
                key={it.id}
                className="grid grid-cols-[1fr_48px_96px_104px] gap-3 px-4 py-3 border-t border-border items-start"
              >
                <div className="min-w-0">
                  <div className="display-heading text-lg">{title}</div>
                  {specLine && <div className="font-body text-xs text-muted-foreground">{specLine}</div>}
                  {distilledLine && (
                    <div className="font-body text-xs text-muted-foreground">{distilledLine}</div>
                  )}
                </div>
                <div className="font-body text-sm">{it.quantity}</div>
                <div className="font-body text-sm">
                  {discounted && (
                    <div className="text-xs text-muted-foreground line-through">{gbp(listPrice)}</div>
                  )}
                  <div style={discounted ? { color: COPPER } : undefined}>{gbp(it.unit_price)}</div>
                </div>
                <div className="font-body text-sm text-right">
                  {discounted && (
                    <div className="text-xs text-muted-foreground line-through">{gbp(listTotal)}</div>
                  )}
                  <div style={discounted ? { color: COPPER } : undefined}>{gbp(it.line_total)}</div>
                </div>
              </div>
            );
          })}
        </div>


        <div className="pt-4 space-y-1 text-right">
          <div className="font-body text-sm text-muted-foreground">Subtotal {gbp(invoice.subtotal)}</div>
          {invoice.discount_amount > 0 && (
            <div className="font-body text-sm" style={{ color: COPPER }}>
              Discount{invoice.discount_code ? ` (${invoice.discount_code})` : ""} −{gbp(invoice.discount_amount)}
            </div>
          )}
          <div className="display-heading text-2xl pt-1" style={{ color: COPPER }}>
            Total due {gbp(invoice.total)}
          </div>
        </div>

        <div className="mt-8 border border-border border-l-4 p-5" style={{ backgroundColor: CREAM, borderLeftColor: COPPER }}>
          <div className="flex items-center gap-2 mb-3">
            <Landmark className="w-4 h-4" style={{ color: COPPER }} />
            <span className="font-body text-[10px] uppercase tracking-[0.25em]" style={{ color: COPPER }}>
              Payment by bank transfer
            </span>
          </div>
          <dl className="space-y-1.5">
            {bankRows.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 font-body text-sm" style={{ color: NAVY }}>
                <dt className="opacity-70">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
            <div
              className="flex justify-between gap-4 font-body text-sm pt-2 border-t mt-2"
              style={{ color: NAVY, borderColor: "rgba(0,0,0,0.1)" }}
            >
              <dt className="opacity-70">Payment reference</dt>
              <dd className="font-semibold tracking-[0.12em]">{invoice.payment_reference}</dd>
            </div>
          </dl>
          <p className="font-body text-[11px] mt-3 leading-relaxed opacity-70" style={{ color: NAVY }}>
            Please quote the payment reference on your transfer so we can match it to your order.
            Cask whisky held under bond is not subject to VAT.
          </p>
        </div>

        <div className="mt-8">
          {confirmed ? (
            <div className="flex items-start gap-3 border p-5" style={{ backgroundColor: CREAM, borderColor: COPPER }}>
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: COPPER }} />
              <div>
                <div className="font-body text-sm" style={{ color: NAVY }}>Payment confirmation received</div>
                <p className="font-body text-xs mt-1 opacity-70" style={{ color: NAVY }}>
                  Thank you — our team has been notified and will confirm once the funds clear.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="font-body text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: COPPER }}>
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
                className="w-full mt-3 font-body text-xs uppercase tracking-[0.2em] text-white px-5 py-3 hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
                style={{ backgroundColor: NAVY }}
              >
                {confirming && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {confirming ? "Sending…" : "I've made the payment"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
