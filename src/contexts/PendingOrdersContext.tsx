import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type PendingOrdersValue = {
  count: number;
  refresh: () => Promise<void>;
};

const PendingOrdersContext = createContext<PendingOrdersValue>({
  count: 0,
  refresh: async () => {},
});

export const usePendingOrders = () => useContext(PendingOrdersContext);

export const PendingOrdersProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setCount(0);
      return;
    }
    const { count: c } = await supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("status", ["awaiting_payment", "client_confirmed"]);
    setCount(c ?? 0);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PendingOrdersContext.Provider value={{ count, refresh }}>{children}</PendingOrdersContext.Provider>
  );
};
