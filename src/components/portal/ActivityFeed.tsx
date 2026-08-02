import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, ShieldCheck, PhoneCall, Sparkles, Clock } from "lucide-react";
import { Link } from "react-router-dom";

type Item = {
  id: string;
  when: string;
  icon: any;
  title: string;
  detail?: string;
  href?: string;
};

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const s = Math.max(0, Math.floor((Date.now() - d) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24); if (days < 7) return `${days}d ago`;
  const w = Math.floor(days / 7); if (w < 5) return `${w}w ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ActivityFeed() {
  const { profile } = useAuth();
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results: Item[] = [];

      // Recent orders (buyer scoped by RLS)
      const { data: orders } = await supabase
        .from("orders")
        .select("id, status, amount, currency, created_at, casks:cask_id(cask_number, distilleries(name)), cask_listings:listing_id(spirit, distilleries(name))")
        .order("created_at", { ascending: false })
        .limit(5);
      for (const o of orders ?? []) {
        const anyO: any = o;
        const label =
          anyO.casks?.distilleries?.name ??
          anyO.cask_listings?.distilleries?.name ??
          anyO.cask_listings?.spirit ??
          "Cask";
        results.push({
          id: `order-${anyO.id}`,
          when: anyO.created_at,
          icon: ShoppingBag,
          title: anyO.status === "paid" ? `Order paid — ${label}` : `Order placed — ${label}`,
          detail: `£${Number(anyO.amount ?? 0).toLocaleString()}`,
          href: "/portal/my-casks",
        });
      }

      // Verification changes (profile timestamps)
      if (profile?.address_verified_at) {
        results.push({
          id: "verif-addr",
          when: profile.address_verified_at as any,
          icon: ShieldCheck,
          title: "Address verified",
          href: "/portal/account",
        });
      }
      if (profile?.age_verified_at) {
        results.push({
          id: "verif-age",
          when: profile.age_verified_at as any,
          icon: ShieldCheck,
          title: "Identity verified",
          href: "/portal/account",
        });
      }

      // New cask listings (last 30 days, active)
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data: listings } = await supabase
        .from("cask_listings")
        .select("id, spirit, created_at, distilleries(name)")
        .eq("status", "active")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(4);
      for (const l of listings ?? []) {
        const anyL: any = l;
        results.push({
          id: `listing-${anyL.id}`,
          when: anyL.created_at,
          icon: Sparkles,
          title: `New listing — ${anyL.distilleries?.name ?? anyL.spirit}`,
          href: "/portal/available",
        });
      }

      // Callback requests (own)
      const { data: cbs } = await supabase
        .from("callback_requests")
        .select("id, created_at, status")
        .order("created_at", { ascending: false })
        .limit(3);
      for (const c of cbs ?? []) {
        const anyC: any = c;
        results.push({
          id: `cb-${anyC.id}`,
          when: anyC.created_at,
          icon: PhoneCall,
          title: anyC.status === "completed" ? "Callback completed" : "Callback requested",
          href: "/portal/callback",
        });
      }

      results.sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime());
      if (!cancelled) setItems(results.slice(0, 8));
    })();
    return () => { cancelled = true; };
  }, [profile?.address_verified_at, profile?.age_verified_at]);

  return (
    <aside className="bg-muted/20 border border-border p-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock className="w-3.5 h-3.5 text-primary" />
        <h3 className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Recent Activity</h3>
      </div>

      {items === null ? (
        <p className="font-body text-xs text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="font-body text-xs text-muted-foreground">No recent activity yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((it) => {
            const Icon = it.icon;
            const inner = (
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 flex items-center justify-center bg-primary/10 border border-primary/20 flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-body text-sm text-foreground truncate">{it.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{timeAgo(it.when)}</span>
                    {it.detail && <span className="font-body text-xs text-muted-foreground">· {it.detail}</span>}
                  </div>
                </div>
              </div>
            );
            return (
              <li key={it.id}>
                {it.href ? (
                  <Link to={it.href} className="block hover:opacity-80 transition-opacity">{inner}</Link>
                ) : inner}
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
