import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, CreditCard, Tag, X } from "lucide-react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getStripe, getStripeEnvironment, hasPaymentsConfigured } from "@/lib/stripe";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { VerificationGateBanner } from "./Account";
import { palletApplies, palletUnitPrice, PALLET_DISCOUNT_PCT, PALLET_MIN_QTY } from "@/lib/pallet";

type AppliedCode = { code: string; percent: number; effective_percent: number };


export default function Checkout() {
  const { items, remove, setQuantity, clear, count } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState<AppliedCode | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const currency = items[0]?.currency ?? "GBP";

  // Per line: automatic pallet discount (7.5% when qty >= 6 on eligible listings)
  // or the applied discount code — whichever is greater, never stacked.
  const codePct = applied?.effective_percent ?? 0;
  const lineBreakdown = items.map((i) => {
    const list = Number(i.list_price || 0);
    const pallet = palletApplies(i.quantity, i.pallet_eligible ? Infinity : 0);
    const palletPct = pallet ? PALLET_DISCOUNT_PCT : 0;
    const pct = Math.max(codePct, palletPct);
    const unit = Math.round(list * (1 - pct / 100) * 100) / 100;
    return { item: i, pct, unit, palletActive: palletPct > 0 && palletPct >= codePct, lineTotal: unit * i.quantity };
  });
  const subtotal = items.reduce((s, i) => s + Number(i.list_price || 0) * i.quantity, 0);
  const total = lineBreakdown.reduce((s, l) => s + l.lineTotal, 0);
  const savings = subtotal - total;
  const palletSavings = lineBreakdown.reduce(
    (s, l) => s + (l.palletActive ? (Number(l.item.list_price || 0) - l.unit) * l.item.quantity : 0),
    0,
  );
  const codeSavings = Math.max(0, savings - palletSavings);
  const palletUnits = lineBreakdown.reduce((s, l) => s + (l.palletActive ? l.item.quantity : 0), 0);

  const applyCode = async () => {
    if (!codeInput.trim()) return;
    setApplying(true);
    const { data, error } = await supabase.rpc("validate_discount_code", { _code: codeInput.trim() });
    setApplying(false);
    if (error) {
      toast({ title: "Could not validate", description: error.message, variant: "destructive" });
      return;
    }
    const res = data as any;
    if (!res?.valid) {
      toast({ title: "Code not applied", description: res?.message ?? "Invalid code", variant: "destructive" });
      setApplied(null);
      return;
    }
    setApplied({ code: res.code, percent: Number(res.percent), effective_percent: Number(res.effective_percent) });
    toast({ title: "Code applied", description: `${Number(res.percent)}% off` });
  };

  const removeCode = () => {
    setApplied(null);
    setCodeInput("");
  };

  const kycOk = profile?.address_verification_status === "verified" && profile?.age_verification_status === "verified";

  const fetchClientSecret = useCallback(async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        items: items.map((i) => ({ listing_id: i.listing_id, quantity: i.quantity })),
        discount_code: applied?.code ?? null,
        environment: getStripeEnvironment(),
        return_url: `${window.location.origin}/portal/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error((data as any)?.error || error?.message || "Failed to start checkout");
    }
    return data.clientSecret as string;
  }, [items, applied]);

  const beginPayment = async () => {
    if (!user || items.length === 0) return;
    if (!kycOk) {
      toast({ title: "Verification required", description: "Complete address and identity verification in your Account first.", variant: "destructive" });
      return;
    }
    if (!hasPaymentsConfigured()) {
      toast({ title: "Payments unavailable", description: "Checkout is not yet configured.", variant: "destructive" });
      return;
    }
    setPlacing(true);
    setCheckoutOpen(true);
    setPlacing(false);
  };

  if (checkoutOpen) {
    return (
      <div className="max-w-4xl w-full">
        <PaymentTestModeBanner />
        <div className="flex items-center justify-between mb-4 mt-4">
          <h1 className="display-heading text-3xl">Secure Checkout</h1>
          <button
            onClick={() => setCheckoutOpen(false)}
            className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-primary"
          >
            ← Back to cart
          </button>
        </div>
        <div className="bg-white border border-border">
          <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    );
  }


  if (items.length === 0) {
    return (
      <div className="max-w-3xl">
        <h1 className="display-heading text-4xl mb-2">Checkout</h1>
        <p className="font-body text-sm text-muted-foreground mb-8">Your cart is currently empty.</p>
        <div className="bg-muted/20 border border-border p-12 text-center">
          <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
          <p className="font-body text-sm text-muted-foreground mb-6">
            Browse available casks and add them to your cart to begin checkout.
          </p>
          <Link
            to="/portal/available"
            className="inline-block font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            View Available Stock
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl w-full min-w-0">
      <h1 className="display-heading text-4xl mb-2">Checkout</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">
        Review your selected casks and submit your order request.
        {applied && <span className="text-primary"> {applied.effective_percent}% discount code applied.</span>}
      </p>

      <VerificationGateBanner />



      <div className="grid lg:grid-cols-3 gap-6 min-w-0">
        <div className="lg:col-span-2 space-y-3 min-w-0">
          {lineBreakdown.map(({ item: i, unit, lineTotal, palletActive }) => {
            const list = Number(i.list_price || 0);
            const discounted = unit < list;
            return (
              <div key={i.listing_id} className="bg-muted/20 border border-border p-3 sm:p-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted flex-shrink-0 overflow-hidden">
                    {i.hero_image_url ? (
                      <img src={i.hero_image_url} alt={i.distillery || i.spirit} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="display-heading text-base sm:text-lg truncate">{i.distillery || i.spirit}</div>
                    <div className="font-body text-xs text-muted-foreground truncate">
                      {i.spirit}
                    </div>
                    <div className="font-body text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                      {discounted && <span className="line-through">£{Math.round(list).toLocaleString()}</span>}
                      <span className={discounted ? "text-primary" : ""}>£{Math.round(unit).toLocaleString()} each</span>
                      {palletActive && (
                        <span className="font-body text-[9px] uppercase tracking-[0.2em] bg-primary/10 border border-primary/30 text-primary px-1.5 py-0.5">
                          Pallet −{PALLET_DISCOUNT_PCT}%
                        </span>
                      )}
                    </div>
                    {i.pallet_eligible && i.quantity < PALLET_MIN_QTY && (
                      <div className="font-body text-[11px] text-muted-foreground mt-1">
                        Add {PALLET_MIN_QTY - i.quantity} more to unlock pallet price
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => remove(i.listing_id)}
                    className="p-2 -mr-2 -mt-1 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                    aria-label="Remove from cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
                  <div className="flex items-stretch border border-border h-9">
                    <button
                      type="button"
                      onClick={() => setQuantity(i.listing_id, i.quantity - 1)}
                      className="px-3 bg-muted hover:bg-muted/70 font-body"
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="px-3 min-w-[2.5rem] flex items-center justify-center font-body text-sm">{i.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(i.listing_id, i.quantity + 1)}
                      className="px-3 bg-muted hover:bg-muted/70 font-body"
                      aria-label="Increase quantity"
                    >+</button>
                  </div>
                  <div className="display-heading text-lg text-primary">
                    £{Math.round(lineTotal).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
          <button
            onClick={clear}
            className="w-full flex items-center justify-center gap-2 font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-destructive border border-border py-3 transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Clear Cart
          </button>
        </div>

        <aside className="bg-muted/20 border border-border p-6 h-fit min-w-0">
          <h2 className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-4">Order Summary</h2>
          <div className="flex justify-between font-body text-sm py-2">
            <span className="text-muted-foreground">Casks</span>
            <span>{count}</span>
          </div>
          <div className="flex justify-between font-body text-sm py-2 border-t border-border">
            <span className="text-muted-foreground">Subtotal</span>
            <span>£{Math.round(subtotal).toLocaleString()}</span>
          </div>
          {palletSavings > 0 && (
            <div className="flex justify-between font-body text-sm py-2 text-primary">
              <span>Pallet discount (−{PALLET_DISCOUNT_PCT}% × {palletUnits})</span>
              <span>−£{Math.round(palletSavings).toLocaleString()}</span>
            </div>
          )}
          {codeSavings > 0 && (
            <div className="flex justify-between font-body text-sm py-2 text-primary">
              <span>Code discount{applied ? ` (${applied.code})` : ""}</span>
              <span>−£{Math.round(codeSavings).toLocaleString()}</span>
            </div>
          )}

          <div className="border-t border-border mt-2 pt-4">
            <label className="block font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
              Discount Code
            </label>
            {applied ? (
              <div className="flex items-center justify-between gap-2 bg-primary/10 border border-primary/30 px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Tag className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-body text-sm tracking-wider truncate">{applied.code}</div>
                    <div className="font-body text-[11px] text-muted-foreground">
                      {applied.percent}% off · effective {applied.effective_percent}%
                    </div>
                  </div>
                </div>
                <button onClick={removeCode} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove code">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCode(); } }}
                  placeholder="Enter code"
                  maxLength={40}
                  className="flex-1 min-w-0 bg-transparent border border-border px-3 py-2 font-body text-sm tracking-wider focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={applyCode}
                  disabled={applying || !codeInput.trim()}
                  className="font-body text-[10px] uppercase tracking-[0.2em] border border-primary text-primary px-3 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
                >
                  {applying ? "…" : "Apply"}
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between font-body text-base py-3 border-t border-border mt-4">
            <span>Total ({currency})</span>
            <span className="display-heading text-2xl text-primary">£{Math.round(total).toLocaleString()}</span>
          </div>

          <button
            onClick={beginPayment}
            disabled={placing || !kycOk}
            className="w-full mt-6 flex items-center justify-center gap-2 font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            {placing ? "Loading…" : "Proceed to Payment"}
          </button>
          <p className="font-body text-[11px] text-muted-foreground mt-3 leading-relaxed">
            You will be able to review and pay securely via Stripe. Your order is confirmed once payment succeeds.
          </p>
        </aside>
      </div>
    </div>
  );
}
