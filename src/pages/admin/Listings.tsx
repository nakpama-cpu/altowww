import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Distillery = { id: string; name: string; region: string | null };
type Listing = {
  id: string;
  distillery_id: string | null;
  spirit: string;
  cask_type: string | null;
  wood: string | null;
  cask_size_litres: number | null;
  fill_date: string | null;
  abv: number | null;
  ola_litres: number | null;
  rla_litres: number | null;
  age_years: number | null;
  list_price: number | null;
  currency: string;
  stock_qty: number;
  reserved_qty: number;
  status: "active" | "hidden" | "sold_out";
  description: string | null;
  hero_image_url: string | null;
  distilleries?: { name: string } | null;
};

const empty: Partial<Listing> = { spirit: "Single Malt Scotch", currency: "GBP", status: "active", stock_qty: 1 };

export default function AdminListings() {
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [distilleries, setDistilleries] = useState<Distillery[]>([]);
  const [editing, setEditing] = useState<Partial<Listing> | null>(null);

  const load = async () => {
    const [{ data: l }, { data: d }] = await Promise.all([
      supabase.from("cask_listings").select("*, distilleries(name)").order("created_at", { ascending: false }),
      supabase.from("distilleries").select("id,name,region").order("name"),
    ]);
    setListings((l ?? []) as Listing[]);
    setDistilleries((d ?? []) as Distillery[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { distilleries: _d, ...rest } = editing as any;
    const payload: any = { ...rest };
    ["abv", "ola_litres", "rla_litres", "age_years", "list_price", "stock_qty", "cask_size_litres"].forEach((k) => {
      if (payload[k] === "" || payload[k] === null || payload[k] === undefined) payload[k] = k === "stock_qty" ? 0 : null;
      else payload[k] = Number(payload[k]);
    });
    const op = editing.id
      ? supabase.from("cask_listings").update(payload).eq("id", editing.id)
      : supabase.from("cask_listings").insert(payload);
    const { error } = await op;
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { setEditing(null); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    const { error } = await supabase.from("cask_listings").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="display-heading text-4xl">Cask Listings</h1>
        <button onClick={() => setEditing({ ...empty })}
          className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-6 py-2 hover:opacity-90">
          + Add Listing
        </button>
      </div>

      <p className="font-body text-sm text-muted-foreground mb-6">
        Listings are what clients see on Available Stock. Set the stock quantity to control how many can be reserved.
        Individual cask numbers are captured later when certificates are uploaded via Holdings.
      </p>

      {editing && (
        <div className="bg-card border border-primary p-6 mb-6 space-y-4">
          <h2 className="display-heading text-xl">{editing.id ? "Edit Listing" : "New Listing"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FSelect label="Distillery" value={editing.distillery_id ?? ""} onChange={(v) => setEditing({ ...editing, distillery_id: v || null })}
              options={[{ value: "", label: "—" }, ...distilleries.map((d) => ({ value: d.id, label: d.name }))]} />
            <F label="Spirit" value={editing.spirit} onChange={(v) => setEditing({ ...editing, spirit: v })} />
            <F label="Cask Type (Barrel/Hogshead/Butt/Puncheon)" value={editing.cask_type ?? ""} onChange={(v) => setEditing({ ...editing, cask_type: v })} />
            <F label="Cask Size (L)" type="number" value={editing.cask_size_litres ?? ""} onChange={(v) => setEditing({ ...editing, cask_size_litres: v as any })} />
            <F label="Wood (e.g. First-fill Bourbon)" value={editing.wood ?? ""} onChange={(v) => setEditing({ ...editing, wood: v })} />
            <F label="Fill Date" type="date" value={editing.fill_date ?? ""} onChange={(v) => setEditing({ ...editing, fill_date: v })} />
            <F label="Age (yrs)" type="number" value={editing.age_years ?? ""} onChange={(v) => setEditing({ ...editing, age_years: v as any })} />
            <F label="ABV %" type="number" value={editing.abv ?? ""} onChange={(v) => setEditing({ ...editing, abv: v as any })} />
            <F label="OLA (L)" type="number" value={editing.ola_litres ?? ""} onChange={(v) => setEditing({ ...editing, ola_litres: v as any })} />
            <F label="RLA (L)" type="number" value={editing.rla_litres ?? ""} onChange={(v) => setEditing({ ...editing, rla_litres: v as any })} />
            <F label="List Price" type="number" value={editing.list_price ?? ""} onChange={(v) => setEditing({ ...editing, list_price: v as any })} />
            <F label="Stock Qty" type="number" value={editing.stock_qty ?? 0} onChange={(v) => setEditing({ ...editing, stock_qty: v as any })} />
            <FSelect label="Status" value={editing.status ?? "active"} onChange={(v) => setEditing({ ...editing, status: v as any })}
              options={[
                { value: "active", label: "Active" }, { value: "hidden", label: "Hidden" }, { value: "sold_out", label: "Sold out" },
              ]} />
            <F label="Hero Image URL" value={editing.hero_image_url ?? ""} onChange={(v) => setEditing({ ...editing, hero_image_url: v })} />
          </div>
          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">Description</label>
            <textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              rows={3} className="w-full bg-transparent border border-border px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-3">
            <button onClick={save}
              className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-6 py-2">Save</button>
            <button onClick={() => setEditing(null)}
              className="font-body text-xs uppercase tracking-[0.25em] border border-border px-6 py-2">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr className="text-left font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="p-3">Distillery</th><th className="p-3">Spirit</th><th className="p-3">Cask</th><th className="p-3">Wood</th>
              <th className="p-3">Age</th><th className="p-3">ABV</th>
              <th className="p-3">List</th>
              <th className="p-3">Stock</th><th className="p-3">Reserved</th><th className="p-3">Avail</th>
              <th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => {
              const avail = Math.max(0, (l.stock_qty ?? 0) - (l.reserved_qty ?? 0));
              return (
                <tr key={l.id} className="border-t border-border">
                  <td className="p-3">{l.distilleries?.name ?? "—"}</td>
                  <td className="p-3">{l.spirit}</td>
                  <td className="p-3">{[l.cask_type, l.cask_size_litres != null ? `${l.cask_size_litres}L` : null].filter(Boolean).join(" ") || "—"}</td>
                  <td className="p-3">{l.wood ?? "—"}</td>
                  <td className="p-3">{l.age_years ?? "—"}</td>
                  <td className="p-3">{l.abv ? `${l.abv}%` : "—"}</td>
                  <td className="p-3">£{l.list_price?.toLocaleString() ?? "—"}</td>
                  <td className="p-3">{l.stock_qty}</td>
                  <td className="p-3">{l.reserved_qty}</td>
                  <td className="p-3 font-medium">{avail}</td>
                  <td className="p-3">{l.status}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => setEditing(l)} className="text-xs underline mr-3">Edit</button>
                    <button onClick={() => remove(l.id)} className="text-xs text-destructive underline">Delete</button>
                  </td>
                </tr>
              );
            })}
            {listings.length === 0 && <tr><td colSpan={11} className="p-8 text-center text-muted-foreground font-body">No listings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const F = ({ label, value, onChange, type = "text" }: any) => (
  <div>
    <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</label>
    <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border border-border px-2 py-1 text-sm" />
  </div>
);
const FSelect = ({ label, value, onChange, options }: any) => (
  <div>
    <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border border-border px-2 py-1 text-sm">
      {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
