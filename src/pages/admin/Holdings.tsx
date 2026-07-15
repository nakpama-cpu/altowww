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
  casks: { cask_number: string | null; distilleries: { name: string } | null } | null;
};

type Listing = {
  id: string;
  spirit: string;
  cask_type: string | null;
  list_price: number | null;
  currency: string;
  stock_qty: number;
  reserved_qty: number;
  distilleries: { name: string } | null;
};

type PendingOrder = {
  id: string;
  buyer_id: string;
  listing_id: string | null;
  amount: number;
  created_at: string;
  profiles: { first_name: string; last_name: string; email: string } | null;
  cask_listings: { spirit: string; distilleries: { name: string } | null } | null;
};

export default function AdminHoldings() {
  const { toast } = useToast();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [clients, setClients] = useState<{ id: string; first_name: string; last_name: string; email: string }[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [form, setForm] = useState<any>({
    owner_id: "",
    listing_id: "",
    cask_number: "",
    order_id: "",
    purchase_price: "",
    purchase_date: new Date().toISOString().slice(0, 10),
    certificate: null as File | null,
  });
  const [busy, setBusy] = useState(false);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const load = async () => {
    const [{ data: h }, { data: cl }, { data: ls }, { data: po }] = await Promise.all([
      supabase.from("holdings").select("*, profiles(first_name,last_name,email), casks(cask_number, distilleries(name))").order("purchase_date", { ascending: false }),
      supabase.from("profiles").select("id,first_name,last_name,email").eq("status", "approved").order("last_name"),
      supabase.from("cask_listings").select("id, spirit, cask_type, list_price, currency, stock_qty, reserved_qty, distilleries(name)").order("created_at", { ascending: false }),
      supabase.from("orders").select("id, buyer_id, listing_id, amount, created_at, profiles!orders_buyer_id_fkey(first_name,last_name,email), cask_listings(spirit, distilleries(name))").is("cask_id", null).order("created_at", { ascending: true }),
    ]);
    setHoldings((h ?? []) as any);
    setClients((cl ?? []) as any);
    setListings((ls ?? []) as any);
    setPendingOrders((po ?? []) as any);
  };
  useEffect(() => { load(); }, []);

  // When choosing a pending order, prefill client/listing/price from it.
  const chooseOrder = (orderId: string) => {
    const o = pendingOrders.find((p) => p.id === orderId);
    if (!o) { setForm({ ...form, order_id: "" }); return; }
    setForm({
      ...form,
      order_id: orderId,
      owner_id: o.buyer_id,
      listing_id: o.listing_id ?? "",
      purchase_price: String(o.amount ?? ""),
    });
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.owner_id || !form.listing_id || !form.cask_number || !form.purchase_price) {
      return toast({ title: "Missing fields", description: "Client, listing, cask number and price are required.", variant: "destructive" });
    }
    setBusy(true);
    try {
      // 1. Create the individual cask (copy specs from the listing)
      const listing = listings.find((l) => l.id === form.listing_id);
      const { data: caskRow, error: caskErr } = await supabase.from("casks").insert({
        cask_number: form.cask_number.trim(),
        listing_id: form.listing_id,
        spirit: listing?.spirit ?? "Single Malt Scotch",
        cask_type: listing?.cask_type ?? null,
        status: "held" as const,
      }).select("id").single();
      if (caskErr || !caskRow) throw caskErr ?? new Error("Could not create cask");

      // 2. Create the holding
      const { data: holdingRow, error: holdingErr } = await supabase.from("holdings").insert({
        owner_id: form.owner_id,
        cask_id: caskRow.id,
        purchase_price: Number(form.purchase_price),
        purchase_date: form.purchase_date,
      }).select("id").single();
      if (holdingErr || !holdingRow) throw holdingErr ?? new Error("Could not create holding");

      // 3. Upload certificate if provided
      if (form.certificate) {
        const path = `${holdingRow.id}/${form.certificate.name}`;
        const { error: upErr } = await supabase.storage.from("cask-certificates").upload(path, form.certificate, { upsert: true });
        if (upErr) throw upErr;
        await supabase.from("holdings").update({ certificate_path: path }).eq("id", holdingRow.id);
      }

      // 4. If fulfilling a pending order, link it
      if (form.order_id) {
        await supabase.from("orders").update({ cask_id: caskRow.id, status: "paid" as const }).eq("id", form.order_id);
      }

      setForm({ owner_id: "", listing_id: "", cask_number: "", order_id: "", purchase_price: "", purchase_date: new Date().toISOString().slice(0, 10), certificate: null });
      toast({ title: "Cask assigned", description: `Cask #${form.cask_number} recorded and certificate uploaded.` });
      load();
    } catch (err: any) {
      toast({ title: "Failed", description: err?.message ?? String(err), variant: "destructive" });
    } finally {
      setBusy(false);
    }
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

      {pendingOrders.length > 0 && (
        <div className="bg-card border border-primary/40 p-6 mb-6">
          <h2 className="display-heading text-lg mb-2">Pending fulfilment · {pendingOrders.length}</h2>
          <p className="font-body text-xs text-muted-foreground mb-4">Orders reserved but not yet assigned to a specific cask.</p>
          <ul className="space-y-2">
            {pendingOrders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-2 text-sm">
                <div>
                  <span className="font-medium">{o.profiles?.first_name} {o.profiles?.last_name}</span>
                  <span className="text-muted-foreground"> · {o.cask_listings?.distilleries?.name ?? "—"} · {o.cask_listings?.spirit}</span>
                </div>
                <div className="text-xs text-muted-foreground">£{Number(o.amount).toLocaleString()} · {o.created_at.slice(0, 10)}</div>
                <button type="button" onClick={() => chooseOrder(o.id)}
                  className="font-body text-[10px] uppercase tracking-[0.2em] border border-primary text-primary px-3 py-1 hover:bg-primary hover:text-primary-foreground">
                  Fulfil
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={create} className="bg-card border border-border p-6 mb-8 grid md:grid-cols-6 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Pending order (optional)</label>
          <select value={form.order_id} onChange={(e) => chooseOrder(e.target.value)}
            className="w-full bg-transparent border border-border px-2 py-1 text-sm">
            <option value="">— None —</option>
            {pendingOrders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.profiles?.first_name} {o.profiles?.last_name} · {o.cask_listings?.distilleries?.name ?? o.cask_listings?.spirit}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Client</label>
          <select required value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
            className="w-full bg-transparent border border-border px-2 py-1 text-sm">
            <option value="">—</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Listing</label>
          <select required value={form.listing_id} onChange={(e) => setForm({ ...form, listing_id: e.target.value })}
            className="w-full bg-transparent border border-border px-2 py-1 text-sm">
            <option value="">—</option>
            {listings.map((l) => <option key={l.id} value={l.id}>{l.distilleries?.name ?? l.spirit} — {l.cask_type ?? l.spirit}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Cask #</label>
          <input required value={form.cask_number} onChange={(e) => setForm({ ...form, cask_number: e.target.value })}
            className="w-full bg-transparent border border-border px-2 py-1 text-sm font-mono" placeholder="e.g. 2024-0417" />
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
        <div className="md:col-span-2">
          <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Certificate (PDF)</label>
          <input type="file" accept="application/pdf" onChange={(e) => setForm({ ...form, certificate: e.target.files?.[0] ?? null })}
            className="w-full text-xs" />
        </div>
        <button type="submit" disabled={busy}
          className="md:col-span-2 font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2 disabled:opacity-50">
          {busy ? "Saving…" : "Assign Cask"}
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
                <td className="p-3 font-mono">{h.casks?.cask_number ?? "—"}</td>
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
