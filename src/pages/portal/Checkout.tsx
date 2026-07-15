import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, CheckCircle2, Tag, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { VerificationGateBanner } from "./Account";

type AppliedCode = { code: string; percent: number; effective_percent: number };

export default function Checkout() {
  const { items, remove, setQuantity, clear, subtotal, count } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState<AppliedCode | null>(null);
  const profileDiscount = Number(profile?.client_discount_pct ?? 0);
  const currency = items[0]?.currency ?? "GBP";

  const effectivePct = applied ? applied.effective_percent : profileDiscount;
  // items already carry the client-discount price; if a code beats it, reduce further.
  const total = applied && applied.effective_percent > profileDiscount
    ? subtotal * (1 - (applied.effective_percent - profileDiscount) / (100 - profileDiscount))
    : subtotal;

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
    if (Number(res.effective_percent) <= profileDiscount) {
      toast({
        title: "Code accepted",
        description: `Your existing ${profileDiscount}% client discount is already equal or better, so no change was applied.`,
      });
    } else {
      toast({ title: `Code applied`, description: `${Number(res.percent)}% off` });
    }
  };

  const removeCode = () => {
    setApplied(null);
    setCodeInput("");
  };

  const placeOrder = async () => {
    if (!user || items.length === 0) return;
    setPlacing(true);
    const rows = items.flatMap((i) =>
      Array.from({ length: i.quantity }, () => ({
        buyer_id: user.id,
        listing_id: i.listing_id,
        amount: Number(i.unit_price.toFixed(2)),
        currency: i.currency,
        status: "pending" as const,
        discount_code: applied?.code ?? null,
      })),
    );
    const { error } = await supabase.from("orders").insert(rows);
    setPlacing(false);
    if (error) {
      toast({ title: "Could not place order", description: error.message, variant: "destructive" });
      return;
    }
    clear();
    toast({
      title: "Order request submitted",
      description: "Our team will be in touch shortly to confirm payment and next steps.",
    });
    navigate("/portal");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl">
        <h1 className="display-heading text-4xl mb-2">Checkout</h1>
        <p className="font-body text-sm text-muted-foreground mb-8">Your cart is currently empty.</p>
        <div className="bg-card border border-border p-12 text-center">
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
        {effectivePct > 0 && <span className="text-primary"> Your {effectivePct}% discount is applied.</span>}
      </p>

      <div className="grid lg:grid-cols-3 gap-6 min-w-0">
        <div className="lg:col-span-2 space-y-3 min-w-0">
          {items.map((i) => {
            const lineTotal = i.unit_price * i.quantity;
            return (
              <div key={i.listing_id} className="bg-card border border-border p-3 sm:p-4">
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
                    <div className="font-body text-xs text-muted-foreground mt-1">
                      £{Math.round(i.unit_price).toLocaleString()} each
                    </div>
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

        <aside className="bg-card border border-border p-6 h-fit min-w-0">
          <h2 className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-4">Order Summary</h2>
          <div className="flex justify-between font-body text-sm py-2">
            <span className="text-muted-foreground">Casks</span>
            <span>{count}</span>
          </div>
          <div className="flex justify-between font-body text-sm py-2 border-t border-border">
            <span className="text-muted-foreground">Subtotal</span>
            <span>£{Math.round(subtotal).toLocaleString()}</span>
          </div>

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
            onClick={placeOrder}
            disabled={placing}
            className="w-full mt-6 flex items-center justify-center gap-2 font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            {placing ? "Submitting…" : "Place Order Request"}
          </button>
          <p className="font-body text-[11px] text-muted-foreground mt-3 leading-relaxed">
            Submitting creates a pending order. An advisor will contact you to confirm payment, paperwork and delivery.
          </p>
        </aside>
      </div>
    </div>
  );
}
