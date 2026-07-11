import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Checkout() {
  const { items, remove, setQuantity, clear, subtotal, count } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const discount = Number(profile?.client_discount_pct ?? 0);
  const currency = items[0]?.currency ?? "GBP";

  const placeOrder = async () => {
    if (!user || items.length === 0) return;
    setPlacing(true);
    // Expand by quantity — one order row per cask unit
    const rows = items.flatMap((i) =>
      Array.from({ length: i.quantity }, () => ({
        buyer_id: user.id,
        cask_id: i.cask_id,
        amount: Number(i.unit_price.toFixed(2)),
        currency: i.currency,
        status: "pending" as const,
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
        {discount > 0 && <span className="text-primary"> Your {discount}% client discount is applied.</span>}
      </p>

      <div className="grid lg:grid-cols-3 gap-6 min-w-0">
        <div className="lg:col-span-2 space-y-3 min-w-0">
          {items.map((i) => {
            const lineTotal = i.unit_price * i.quantity;
            return (
              <div key={i.cask_id} className="bg-card border border-border p-3 sm:p-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted flex-shrink-0 overflow-hidden">
                    {i.hero_image_url ? (
                      <img src={i.hero_image_url} alt={i.cask_number} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="display-heading text-base sm:text-lg truncate">{i.distillery || i.spirit}</div>
                    <div className="font-body text-xs text-muted-foreground truncate">
                      Cask #{i.cask_number} · {i.spirit}
                    </div>
                    <div className="font-body text-xs text-muted-foreground mt-1">
                      £{Math.round(i.unit_price).toLocaleString()} each
                    </div>
                  </div>
                  <button
                    onClick={() => remove(i.cask_id)}
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
                      onClick={() => setQuantity(i.cask_id, i.quantity - 1)}
                      className="px-3 bg-muted hover:bg-muted/70 font-body"
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="px-3 min-w-[2.5rem] flex items-center justify-center font-body text-sm">{i.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(i.cask_id, i.quantity + 1)}
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
          <div className="flex justify-between font-body text-base py-3 border-t border-border mt-2">
            <span>Total ({currency})</span>
            <span className="display-heading text-2xl text-primary">£{Math.round(subtotal).toLocaleString()}</span>
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
