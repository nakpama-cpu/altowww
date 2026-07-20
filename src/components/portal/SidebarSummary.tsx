import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck } from "lucide-react";

export default function SidebarSummary() {
  const { profile } = useAuth();
  const [count, setCount] = useState<number | null>(null);
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("holdings")
        .select("purchase_price");
      if (cancelled || !data) return;
      setCount(data.length);
      setValue(data.reduce((s, r: any) => s + Number(r.purchase_price ?? 0), 0));
    })();
    return () => { cancelled = true; };
  }, []);

  const kycVerified =
    profile?.address_verification_status === "verified" &&
    profile?.age_verification_status === "verified";

  return (
    <div className="px-6 pt-4 pb-5 border-b border-secondary-foreground/10">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="font-body text-[9px] uppercase tracking-[0.25em] text-secondary-foreground/50 mb-1">Casks</div>
          <div className="display-heading text-xl text-secondary-foreground">{count ?? "—"}</div>
        </div>
        <div>
          <div className="font-body text-[9px] uppercase tracking-[0.25em] text-secondary-foreground/50 mb-1">Portfolio</div>
          <div className="display-heading text-xl text-secondary-foreground">
            {value != null ? `£${Math.round(value).toLocaleString()}` : "—"}
          </div>
        </div>
      </div>
      {kycVerified && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 bg-primary/15 border border-primary/30">
          <ShieldCheck className="w-3 h-3 text-primary" />
          <span className="font-body text-[9px] uppercase tracking-[0.25em] text-primary">Verified</span>
        </div>
      )}
    </div>
  );
}
