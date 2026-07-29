import { useParams, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import InvoiceView, { useInvoice } from "@/components/invoice/InvoiceView";

export default function InvoicePage() {
  const { token = "" } = useParams();
  const [params] = useSearchParams();
  const isNew = params.get("new") === "1";

  const { loading, invoice, items, bank, error, reload } = useInvoice(token);

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

  const canReturn = invoice.status !== "paid" && invoice.status !== "cancelled";

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {canReturn ? (
            <Link
              to="/portal/checkout"
              className="inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to checkout
            </Link>
          ) : <span />}
          <Link
            to="/portal"
            className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary"
          >
            Back to portal
          </Link>
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

        <InvoiceView token={token} invoice={invoice} items={items} bank={bank} onConfirmed={reload} />
      </div>
    </div>
  );
}
