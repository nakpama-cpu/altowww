import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Wine, TrendingUp, Calendar } from "lucide-react";

type HoldingSummary = {
  count: number;
  totalValue: number;
  latest: { cask_number: string; distillery: string | null; purchase_date: string } | null;
};

export default function Dashboard() {
  const { profile } = useAuth();
  const [summary, setSummary] = useState<HoldingSummary>({ count: 0, totalValue: 0, latest: null });

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("holdings")
        .select("purchase_price, purchase_date, casks(cask_number, distilleries(name))")
        .order("purchase_date", { ascending: false });
      if (!data) return;
      const total = data.reduce((s, r: any) => s + Number(r.purchase_price ?? 0), 0);
      const first: any = data[0];
      setSummary({
        count: data.length,
        totalValue: total,
        latest: first ? {
          cask_number: first.casks?.cask_number ?? "",
          distillery: first.casks?.distilleries?.name ?? null,
          purchase_date: first.purchase_date,
        } : null,
      });
    })();
  }, []);

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <h1 className="display-heading text-4xl md:text-5xl mb-2">Welcome, {profile?.first_name || "Investor"}.</h1>
        <p className="font-body text-sm text-muted-foreground">Your whisky portfolio at a glance.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Card icon={Wine} label="Casks Held" value={summary.count.toString()} />
        <Card icon={TrendingUp} label="Total Purchase Value" value={`£${summary.totalValue.toLocaleString()}`} />
        <Card icon={Calendar} label="Most Recent" value={summary.latest ? summary.latest.cask_number : "—"}
          sub={summary.latest?.distillery ?? ""} />
      </div>

      {profile && profile.client_discount_pct > 0 && (
        <div className="bg-primary/5 border border-primary/30 p-6 mb-10">
          <div className="font-body text-[10px] uppercase tracking-[0.25em] text-primary mb-2">Your Discount</div>
          <p className="display-heading text-2xl">{profile.client_discount_pct}% off list prices</p>
          <p className="font-body text-sm text-muted-foreground mt-2">Applied automatically to available stock.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/portal/my-casks" className="block bg-card border border-border p-8 hover:border-primary transition-colors">
          <h3 className="display-heading text-xl mb-2">View My Casks</h3>
          <p className="font-body text-sm text-muted-foreground">Full details, specs, and certificates.</p>
        </Link>
        <Link to="/portal/available" className="block bg-card border border-border p-8 hover:border-primary transition-colors">
          <h3 className="display-heading text-xl mb-2">Browse Available Stock</h3>
          <p className="font-body text-sm text-muted-foreground">Curated casks ready for purchase.</p>
        </Link>
      </div>
    </div>
  );
}

const Card = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) => (
  <div className="bg-card border border-border p-6">
    <Icon className="w-5 h-5 text-primary mb-3" />
    <div className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">{label}</div>
    <div className="display-heading text-2xl">{value}</div>
    {sub && <div className="font-body text-xs text-muted-foreground mt-1">{sub}</div>}
  </div>
);
