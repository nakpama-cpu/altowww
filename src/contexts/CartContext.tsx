import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  cask_id: string;
  cask_number: string;
  distillery: string;
  spirit: string;
  list_price: number;
  unit_price: number; // after client discount
  currency: string;
  hero_image_url: string | null;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (cask_id: string) => void;
  clear: () => void;
  has: (cask_id: string) => boolean;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue>({
  items: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
  has: () => false,
  count: 0,
  subtotal: 0,
});

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "alto.cart.v1";

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

  const add = (item: CartItem) =>
    setItems((prev) => (prev.some((i) => i.cask_id === item.cask_id) ? prev : [...prev, item]));
  const remove = (cask_id: string) =>
    setItems((prev) => prev.filter((i) => i.cask_id !== cask_id));
  const clear = () => setItems([]);
  const has = (cask_id: string) => items.some((i) => i.cask_id === cask_id);
  const subtotal = items.reduce((s, i) => s + Number(i.unit_price || 0), 0);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, has, count: items.length, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};
