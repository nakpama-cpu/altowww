import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  listing_id: string;
  distillery: string;
  spirit: string;
  list_price: number;
  unit_price: number; // price charged per unit (list price or code-discounted)
  currency: string;
  hero_image_url: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  setQuantity: (listing_id: string, quantity: number) => void;
  remove: (listing_id: string) => void;
  clear: () => void;
  has: (listing_id: string) => boolean;
  count: number; // total units
  subtotal: number;
};

const CartContext = createContext<CartContextValue>({
  items: [],
  add: () => {},
  setQuantity: () => {},
  remove: () => {},
  clear: () => {},
  has: () => false,
  count: 0,
  subtotal: 0,
});

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "alto.cart.v3";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add: CartContextValue["add"] = (item) => {
    const qty = Math.max(1, Math.floor(item.quantity ?? 1));
    setItems((prev) => {
      const i = prev.findIndex((p) => p.listing_id === item.listing_id);
      if (i === -1) return [...prev, { ...item, quantity: qty } as CartItem];
      const next = [...prev];
      next[i] = { ...next[i], quantity: next[i].quantity + qty };
      return next;
    });
  };
  const setQuantity = (listing_id: string, quantity: number) =>
    setItems((prev) =>
      prev
        .map((i) => (i.listing_id === listing_id ? { ...i, quantity: Math.max(0, Math.floor(quantity)) } : i))
        .filter((i) => i.quantity > 0),
    );
  const remove = (listing_id: string) => setItems((prev) => prev.filter((i) => i.listing_id !== listing_id));
  const clear = () => setItems([]);
  const has = (listing_id: string) => items.some((i) => i.listing_id === listing_id);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + Number(i.unit_price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, add, setQuantity, remove, clear, has, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};
