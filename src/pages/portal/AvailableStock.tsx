import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type Cask = {
  id: string;
  cask_number: string;
  spirit: string;
  cask_type: string | null;
  fill_date: string | null;
  abv: number | null;
  ola_litres: number | null;
  age_years: number | null;
  list_price: number | null;
  currency: string;
  description: string | null;
  hero_image_url: string | null;
  distilleries: { name: string; region: string | null } | null;
};

export default function AvailableStock() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [casks, setCasks] = useState<Cask[]>([]);
  const [loading, setLoading] = useState(true);
  const discount = Number(profile?.client_discount_pct ?? 0);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("casks")
        .select("id, cask_number, spirit, cask_type, fill_date, abv, ola_litres, age_years, list_price, currency, description, hero_image_url, distilleries(name, region)")
        .eq("status", "available")
        .order("created_at", { ascending: false });
      if (error) toast({ title: "Could not load stock", description: error.message, variant: "destructive" });
      setCasks((data ?? []) as any);
      setLoading(false);
    })();
  }, [toast]);

  const priceFor = (list: number | null) => {
    if (!list) return null;
    return discount > 0 ? list * (1 - discount / 100) : list;
  };

  return (
    <div className="max-w-7xl">
      <h1 className="display-heading text-4xl mb-2">Available Stock</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">
        Curated casks ready for purchase.
        {discount > 0 && <span className="text-primary"> Your {discount}% client discount is applied.</span>}
      </p>

      {loading ? (
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      ) : casks.length === 0 ? (
        <div className="bg-card border border-border p-12 text-center">
          <p className="font-body text-sm text-muted-foreground">No casks currently available. Check back soon.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {casks.map((c) => {
            const price = priceFor(c.list_price);
            return (
              <div key={c.id} className="bg-card border border-border overflow-hidden flex flex-col">
                {c.hero_image_url && (
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img src={c.hero_image_url} alt={c.cask_number} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">
                    Cask #{c.cask_number}
                  </div>
                  <h3 className="display-heading text-xl mb-1">{c.distilleries?.name ?? c.spirit}</h3>
                  <p className="font-body text-xs text-muted-foreground mb-4">
                    {[c.distilleries?.region, c.cask_type, c.age_years ? `${c.age_years} yrs` : null].filter(Boolean).join(" · ")}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                    {c.abv && <Mini label="ABV" v={`${c.abv}%`} />}
                    {c.ola_litres && <Mini label="OLA" v={`${c.ola_litres} L`} />}
                    {c.fill_date && <Mini label="Filled" v={c.fill_date.slice(0, 4)} />}
                  </div>
                  {c.description && (
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-3">{c.description}</p>
                  )}
                  <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
                    <div>
                      {price && (
                        <>
                          {discount > 0 && c.list_price && (
                            <div className="font-body text-xs text-muted-foreground line-through">
                              £{Number(c.list_price).toLocaleString()}
                            </div>
                          )}
                          <div className="display-heading text-2xl text-primary">
                            £{Math.round(price).toLocaleString()}
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      disabled
                      className="font-body text-xs uppercase tracking-[0.2em] bg-primary/40 text-primary-foreground px-5 py-2 cursor-not-allowed"
                      title="Checkout activates once payments are enabled"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const Mini = ({ label, v }: { label: string; v: string }) => (
  <div className="border border-border p-2 text-center">
    <div className="font-body text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    <div className="font-body text-xs mt-0.5">{v}</div>
  </div>
);
