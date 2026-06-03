import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Holding = {
  id: string;
  owner_id: string;
  cask_id: string;
  purchase_price: number;
  purchase_date: string;
  certificate_path: string | null;
  profiles: { first_name: string; last_name: string; email: string } | null;
  casks: { cask_number: string; distilleries: { name: string } | null } | null;
};

export default function AdminHoldings() {
  const { toast } = useToast();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [clients, setClients] = useState<{ id: string; first_name: string; last_name: string; email: string }[]>([]);
  const [casks, setCasks] = useState<{ id: string; cask_number: string }[]>([]);
  const [form, setForm] = useState<any>({ owner_id: "", cask_id: "", purchase_price: "", purchase_date: new Date().toISOString().slice(0, 10) });
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const load = async () => {
    const [{ data: h }, { data: cl }, { data: cs }] = await Promise.all([
      supabase.from("holdings").select("*, profiles(first_name,last_name,email), casks(cask_number, distilleries(name))").order("purchase_date", { ascending: false }),
      supabase.from("profiles").select("id,first_name,last_name,email").eq("status", "approved").order("last_name"),
      supabase.from("casks").select("id,cask_number").order("cask_number"),
    ]);
    setHoldings((h ?? []) as any);
    setClients((cl ?? []) as any);
    setCasks((cs ?? []) as any);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("holdings").insert({
      owner_id: form.owner_id,
      cask_id: form.cask_id,
      purchase_price: Number(form.purchase_price),
      purchase_date: form.purchase_date,
    });
    if (error) return toast({ title: "Insert failed", description: error.message, variant: "destructive" });
    // Mark cask held
    await supabase.from("casks").update({ status: "held" }).eq("id", form.cask_id);
    setForm({ owner_id: "", cask_id: "", purchase_price: "", purchase_date: new Date().toISOString().slice(0, 10) });
    load();
  };

  const uploadCert = async (holdingId: string, file: File) => {
    setUploadingFor(holdingId);
    const path = `${holdingId}/${file.name}`;
    const { error } = await supabase.storage.from("cask-certificates").upload(path, file, { upsert: true });
    if (error) {
      setUploadingFor(null);
      return toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    }
    await supabase.from("holdings").update({ certificate_path: path }).eq("id", holdingId);
    setUploadingFor(null);
    toast({ title: "Certificate uploaded" });
    load();
  };

  return (
    <div className="max-w-7xl">
      <h1 className="display-heading text-4xl mb-8">Holdings</h1>

      <form onSubmit={create} className="bg-card border border-border p-6 mb-8 grid md:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Client</label>
          <select required value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
            className="w-full bg-transparent border border-border px-2 py-1 text-sm">
            <option value="">—</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Cask</label>
          <select required value={form.cask_id} onChange={(e) => setForm({ ...form, cask_id: e.target.value })}
            className="w-full bg-transparent border border-border px-2 py-1 text-sm">
            <option value="">—</option>
            {casks.map((c) => <option key={c.id} value={c.id}>{c.cask_number}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Purchase Price</label>
          <input required type="number" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
            className="w-full bg-transparent border border-border px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Date</label>
          <input required type="date" value={form.purchase_date} onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
            className="w-full bg-transparent border border-border px-2 py-1 text-sm" />
        </div>
        <button type="submit" className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2">
          Assign Cask
        </button>
      </form>

      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="p-3">Client</th><th className="p-3">Cask</th><th className="p-3">Distillery</th>
              <th className="p-3">Price</th><th className="p-3">Date</th><th className="p-3">Certificate</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.id} className="border-t border-border">
                <td className="p-3">{h.profiles?.first_name} {h.profiles?.last_name}</td>
                <td className="p-3 font-mono">{h.casks?.cask_number}</td>
                <td className="p-3">{h.casks?.distilleries?.name}</td>
                <td className="p-3">£{Number(h.purchase_price).toLocaleString()}</td>
                <td className="p-3">{h.purchase_date}</td>
                <td className="p-3">
                  {h.certificate_path ? <span className="text-xs text-muted-foreground">Uploaded</span> : <span className="text-xs text-muted-foreground">—</span>}
                  <label className="ml-3 text-xs underline cursor-pointer">
                    {uploadingFor === h.id ? "Uploading…" : "Upload PDF"}
                    <input type="file" accept="application/pdf" className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadCert(h.id, e.target.files[0])} />
                  </label>
                </td>
              </tr>
            ))}
            {holdings.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-body">No holdings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
