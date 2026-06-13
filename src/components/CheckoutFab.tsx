import { Link, useLocation } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutFab() {
  const { count, subtotal } = useCart();
  const location = useLocation();

  if (count === 0) return null;
  if (location.pathname === "/portal/checkout") return null;
  if (!location.pathname.startsWith("/portal")) return null;

  return (
    <Link
      to="/portal/checkout"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-primary text-primary-foreground px-5 py-3 shadow-lg hover:opacity-90 transition-opacity font-body text-xs uppercase tracking-[0.2em]"
    >
      <ShoppingBag className="w-4 h-4" />
      <span>Go to Checkout</span>
      <span className="flex items-center gap-2 pl-3 ml-1 border-l border-primary-foreground/30">
        <span className="bg-primary-foreground/20 px-2 py-0.5 rounded-full text-[10px]">{count}</span>
        <span className="tracking-normal text-sm">£{Math.round(subtotal).toLocaleString()}</span>
      </span>
    </Link>
  );
}
