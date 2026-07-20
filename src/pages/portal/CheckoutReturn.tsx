import { useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();

  useEffect(() => {
    if (sessionId) clear();
  }, [sessionId]);

  return (
    <div className="max-w-2xl">
      <div className="bg-muted/20 border border-border p-10 text-center">
        <CheckCircle2 className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="display-heading text-3xl mb-3">Thank you</h1>
        <p className="font-body text-sm text-muted-foreground mb-2">
          Your payment {sessionId ? "was received" : "status is unknown"}. A confirmation email is on the way.
        </p>
        {sessionId && (
          <p className="font-body text-[11px] text-muted-foreground mb-6">Reference: {sessionId}</p>
        )}
        <div className="flex gap-3 justify-center mt-6">
          <Link
            to="/portal/my-casks"
            className="font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            View My Casks
          </Link>
          <Link
            to="/portal/available"
            className="font-body text-xs uppercase tracking-[0.2em] border border-border px-5 py-2.5 hover:border-primary transition-colors"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}
