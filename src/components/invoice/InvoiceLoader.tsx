import { Loader2 } from "lucide-react";
import InvoiceView, { useInvoice } from "@/components/invoice/InvoiceView";

export default function InvoiceLoader({ token }: { token: string }) {
  const { loading, invoice, items, bank, error, reload } = useInvoice(token);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="p-6 font-body text-sm text-muted-foreground">
        This invoice could not be loaded. Please contact us and we'll resend it.
      </div>
    );
  }

  return <InvoiceView token={token} invoice={invoice} items={items} bank={bank} onConfirmed={reload} />;
}
