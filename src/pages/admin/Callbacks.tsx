import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type C = {
  id: string;
  reason: string | null;
  message: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
  profiles: { first_name: string; last_name: string; email: string; phone: string } | null;
};

export default function AdminCallbacks() {
  const { toast } = useToast();
  const [rows, setRows] = useState<C[]>([]);

  const load = async () => {
    const { data } = await supabase.from("callback_requests")
      .select("*, profiles(first_name,last_name,email,phone)")
      .order("created_at", { ascending: false });
    setRows((data ?? []) as any);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: C["status"]) => {
    const { error } = await supabase.from("callback_requests").update({ status }).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="max-w-5xl">
      <h1 className="display-heading text-4xl mb-8">Callback Requests</h1>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="bg-card border border-border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="font-body text-sm font-semibold">{r.profiles?.first_name} {r.profiles?.last_name}</div>
                <div className="font-body text-xs text-muted-foreground">{r.profiles?.email} · {r.profiles?.phone}</div>
                <div className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
              <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value as any)}
                className="bg-transparent border border-border px-2 py-1 text-xs">
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="closed">closed</option>
              </select>
            </div>
            {r.reason && <div className="font-body text-xs uppercase tracking-[0.2em] text-primary mb-1">{r.reason}</div>}
            {r.message && <p className="font-body text-sm text-muted-foreground">{r.message}</p>}
          </div>
        ))}
        {rows.length === 0 && (
          <div className="bg-card border border-border p-12 text-center text-muted-foreground font-body text-sm">
            No callback requests.
          </div>
        )}
      </div>
    </div>
  );
}
