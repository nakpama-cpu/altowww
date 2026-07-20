import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Wine, Store, PhoneCall, ArrowUpRight } from "lucide-react";
import ActivityFeed from "@/components/portal/ActivityFeed";

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

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mb-2">{today}</p>
        <h1 className="display-heading text-4xl md:text-5xl mb-2">Welcome, {profile?.first_name || "Investor"}.</h1>
        <p className="font-body text-sm text-muted-foreground">Your whisky portfolio at a glance.</p>
      </div>

      {/* Hero portfolio card */}
      <Link
        to="/portal/my-casks"
        className="group block bg-secondary text-secondary-foreground p-8 md:p-10 mb-6 border border-secondary hover:border-primary transition-colors relative overflow-hidden"
      >
        <div className="absolute top-6 right-6 flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.25em] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          View portfolio <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
        <div className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mb-3">Portfolio Value</div>
        <div className="display-heading text-5xl md:text-6xl mb-1 text-secondary-foreground">
          £{summary.totalValue.toLocaleString()}
        </div>
        <div className="font-body text-sm text-secondary-foreground/70">
          Across {summary.count} {summary.count === 1 ? "cask" : "casks"}
          {summary.latest?.distillery && ` · Latest: ${summary.latest.distillery}`}
        </div>
      </Link>

      {/* Quick actions + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4 content-start">
          <QuickAction to="/portal/my-casks" icon={Wine} label="My Casks" sub="Specs & certificates" />
          <QuickAction to="/portal/available" icon={Store} label="Available" sub="Curated stock" />
          <QuickAction to="/portal/callback" icon={PhoneCall} label="Callback" sub="Speak to an advisor" />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}

const QuickAction = ({ to, icon: Icon, label, sub }: { to: string; icon: any; label: string; sub: string }) => (
  <Link to={to} className="group block bg-muted/20 border border-border p-6 hover:border-primary transition-colors">
    <div className="w-9 h-9 flex items-center justify-center bg-primary/10 border border-primary/20 mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      <Icon className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
    </div>
    <div className="display-heading text-lg mb-0.5">{label}</div>
    <div className="font-body text-xs text-muted-foreground">{sub}</div>
  </Link>
);
