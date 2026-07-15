import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, X } from "lucide-react";

type Code = {
  id: string;
  code: string;
  percent: number;
  expires_at: string | null;
  active: boolean;
  notes: string | null;
  created_at: string;
};

type Assignment = {
  id: string;
  user_id: string;
  redeemed_at: string | null;
  profile: { first_name: string; last_name: string; email: string } | null;
};

type Client = { id: string; first_name: string; last_name: string; email: string };

export default function AdminDiscountCodes() {
  const { toast } = useToast();
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ code: "", percent: "15", expires_at: "", notes: "" });
  const [selected, setSelected] = useState<Code | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [addClientId, setAddClientId] = useState("");

  const loadCodes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) toast({ title: "Load failed", description: error.message, variant: "destructive" });
    else setCodes((data ?? []) as Code[]);
  };

  const loadClients = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email")
      .eq("status", "approved")
      .order("first_name");
    setClients((data ?? []) as Client[]);
  };

  const loadAssignments = async (codeId: string) => {
    const { data, error } = await supabase
      .from("discount_code_clients")
      .select("id, user_id, redeemed_at, profile:profiles(first_name, last_name, email)")
      .eq("code_id", codeId)
      .order("created_at");
    if (error) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
      return;
    }
    setAssignments((data ?? []) as unknown as Assignment[]);
  };

  useEffect(() => {
    loadCodes();
    loadClients();
  }, []);

  useEffect(() => {
    if (selected) loadAssignments(selected.id);
    else setAssignments([]);
  }, [selected]);

  const createCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const payload: any = {
      code: form.code.trim().toUpperCase(),
      percent: Number(form.percent),
      notes: form.notes.trim() || null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };
    const { error } = await supabase.from("discount_codes").insert(payload);
    setCreating(false);
    if (error) {
      toast({ title: "Create failed", description: error.message, variant: "destructive" });
      return;
    }
    setForm({ code: "", percent: "15", expires_at: "", notes: "" });
    toast({ title: "Code created" });
    loadCodes();
  };

  const toggleActive = async (c: Code) => {
    const { error } = await supabase.from("discount_codes").update({ active: !c.active }).eq("id", c.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else loadCodes();
  };

  const deleteCode = async (c: Code) => {
    if (!confirm(`Delete code ${c.code}? All assignments and redemption history will be lost.`)) return;
    const { error } = await supabase.from("discount_codes").delete().eq("id", c.id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      if (selected?.id === c.id) setSelected(null);
      loadCodes();
    }
  };

  const assignClient = async () => {
    if (!selected || !addClientId) return;
    const { error } = await supabase
      .from("discount_code_clients")
      .insert({ code_id: selected.id, user_id: addClientId });
    if (error) {
      toast({ title: "Assign failed", description: error.message, variant: "destructive" });
      return;
    }
    setAddClientId("");
    loadAssignments(selected.id);
  };

  const unassign = async (a: Assignment) => {
    if (a.redeemed_at && !confirm("This client has already redeemed the code. Remove anyway?")) return;
    const { error } = await supabase.from("discount_code_clients").delete().eq("id", a.id);
    if (error) toast({ title: "Remove failed", description: error.message, variant: "destructive" });
    else if (selected) loadAssignments(selected.id);
  };

  const availableClients = clients.filter((c) => !assignments.some((a) => a.user_id === c.id));

  return (
    <div className="max-w-6xl">
      <h1 className="display-heading text-4xl mb-2">Discount Codes</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">
        Create codes and assign them to specific clients. Each assigned client can redeem once.
      </p>

      <form onSubmit={createCode} className="bg-card border border-border p-6 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Code</label>
          <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="WELCOME15" maxLength={40}
            className="w-full bg-transparent border-b border-border py-2 font-body text-sm uppercase tracking-wider focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">% Discount</label>
          <input required type="number" min="0.01" max="100" step="0.01" value={form.percent}
            onChange={(e) => setForm({ ...form, percent: e.target.value })}
            className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Expires</label>
          <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
            className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Notes</label>
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="e.g. Christmas email blast"
            className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
        </div>
        <div className="md:col-span-5">
          <button type="submit" disabled={creating}
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-5 py-2.5 hover:opacity-90 disabled:opacity-50">
            <Plus className="w-4 h-4" /> {creating ? "Creating…" : "Create Code"}
          </button>
        </div>
      </form>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border">
          <div className="p-4 border-b border-border font-body text-[10px] uppercase tracking-[0.25em] text-primary">All Codes</div>
          {loading ? (
            <div className="p-6 font-body text-sm text-muted-foreground">Loading…</div>
          ) : codes.length === 0 ? (
            <div className="p-6 font-body text-sm text-muted-foreground">No codes yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {codes.map((c) => {
                const isSelected = selected?.id === c.id;
                const expired = c.expires_at && new Date(c.expires_at) < new Date();
                return (
                  <button key={c.id} type="button" onClick={() => setSelected(c)}
                    className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${isSelected ? "bg-muted/50" : ""}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="display-heading text-lg tracking-wider">{c.code}</div>
                        <div className="font-body text-xs text-muted-foreground mt-0.5">
                          {c.percent}% off
                          {c.expires_at && <> · expires {new Date(c.expires_at).toLocaleDateString()}</>}
                          {c.notes && <> · {c.notes}</>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {expired && <span className="font-body text-[10px] uppercase tracking-[0.2em] text-destructive">Expired</span>}
                        <span className={`font-body text-[10px] uppercase tracking-[0.2em] ${c.active ? "text-primary" : "text-muted-foreground"}`}>
                          {c.active ? "Active" : "Inactive"}
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); toggleActive(c); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); toggleActive(c); } }}
                          className="cursor-pointer font-body text-[10px] uppercase tracking-[0.2em] border border-border px-2 py-1 hover:bg-background"
                        >
                          {c.active ? "Disable" : "Enable"}
                        </span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); deleteCode(c); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); deleteCode(c); } }}
                          className="cursor-pointer p-1 text-muted-foreground hover:text-destructive"
                          aria-label="Delete code"
                        >
                          <Trash2 className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-card border border-border">
          <div className="p-4 border-b border-border font-body text-[10px] uppercase tracking-[0.25em] text-primary">
            {selected ? `Assigned Clients — ${selected.code}` : "Select a code to manage assignments"}
          </div>

          {selected && (
            <div className="p-4 border-b border-border flex items-end gap-2">
              <div className="flex-1">
                <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Add client</label>
                <select value={addClientId} onChange={(e) => setAddClientId(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary">
                  <option value="">Select an approved client…</option>
                  {availableClients.map((c) => (
                    <option key={c.id} value={c.id}>{c.first_name} {c.last_name} — {c.email}</option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={assignClient} disabled={!addClientId}
                className="font-body text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-4 py-2 hover:opacity-90 disabled:opacity-50">
                Assign
              </button>
            </div>
          )}

          <div className="divide-y divide-border">
            {selected && assignments.length === 0 && (
              <div className="p-6 font-body text-sm text-muted-foreground">No clients assigned yet.</div>
            )}
            {assignments.map((a) => (
              <div key={a.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-body text-sm">
                    {a.profile?.first_name} {a.profile?.last_name}
                  </div>
                  <div className="font-body text-xs text-muted-foreground truncate">{a.profile?.email}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {a.redeemed_at ? (
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Redeemed {new Date(a.redeemed_at).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="font-body text-[10px] uppercase tracking-[0.2em] text-primary">Unused</span>
                  )}
                  <button onClick={() => unassign(a)} className="p-1 text-muted-foreground hover:text-destructive" aria-label="Remove assignment">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
