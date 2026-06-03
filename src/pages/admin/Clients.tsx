import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Client = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "suspended";
  client_discount_pct: number;
  created_at: string;
};

export default function AdminClients() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);

  const load = async () => {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setClients((data ?? []) as Client[]);
  };

  useEffect(() => { load(); }, []);

  const update = async (id: string, patch: Partial<Client>) => {
    const { error } = await supabase.from("profiles").update(patch).eq("id", id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="max-w-7xl">
      <h1 className="display-heading text-4xl mb-8">Clients</h1>
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th>
              <th className="p-3">Status</th><th className="p-3">Discount %</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3">{c.first_name} {c.last_name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">
                  <select value={c.status} onChange={(e) => update(c.id, { status: e.target.value as any })}
                    className="bg-transparent border border-border px-2 py-1 text-xs">
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="suspended">suspended</option>
                  </select>
                </td>
                <td className="p-3">
                  <input type="number" min={0} max={100} defaultValue={c.client_discount_pct}
                    onBlur={(e) => update(c.id, { client_discount_pct: Number(e.target.value) })}
                    className="w-20 bg-transparent border border-border px-2 py-1 text-xs" />
                </td>
                <td className="p-3 font-body text-xs text-muted-foreground">
                  Joined {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-body text-sm">No clients yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
