import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Distillery = { id: string; name: string; region: string | null };
type Cask = {
  id: string;
  cask_number: string;
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
  status: "available" | "reserved" | "held" | "sold";
  description: string | null;
  hero_image_url: string | null;
};

const empty: Partial<Cask> = { spirit: "Single Malt Scotch", currency: "GBP", status: "available" };

export default function AdminCasks() {
  const { toast } = useToast();
  const [casks, setCasks] = useState<Cask[]>([]);
  const [distilleries, setDistilleries] = useState<Distillery[]>([]);
  const [editing, setEditing] = useState<Partial<Cask> | null>(null);

  const load = async () => {
    const [{ data: c }, { data: d }] = await Promise.all([
      supabase.from("casks").select("*").order("created_at", { ascending: false }),
      supabase.from("distilleries").select("id,name,region").order("name"),
    ]);
    setCasks((c ?? []) as Cask[]);
    setDistilleries((d ?? []) as Distillery[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload: any = { ...editing };
    // Numeric coercion
    ["abv", "ola_litres", "rla_litres", "age_years", "list_price", "cask_size_litres"].forEach((k) => {
      if (payload[k] === "" || payload[k] === null || payload[k] === undefined) payload[k] = null;
      else payload[k] = Number(payload[k]);
    });
    const op = editing.id
      ? supabase.from("casks").update(payload).eq("id", editing.id)
      : supabase.from("casks").insert(payload);
    const { error } = await op;
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { setEditing(null); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this cask?")) return;
    const { error } = await supabase.from("casks").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="display-heading text-4xl">Casks</h1>
        <button onClick={() => setEditing({ ...empty })}
          className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-6 py-2 hover:opacity-90">
          + Add Cask
        </button>
      </div>

      {editing && (
        <div className="bg-card border border-primary p-6 mb-6 space-y-4">
          <h2 className="display-heading text-xl">{editing.id ? "Edit Cask" : "New Cask"}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <F label="Cask #" value={editing.cask_number} onChange={(v) => setEditing({ ...editing, cask_number: v })} />
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
            <FSelect label="Status" value={editing.status ?? "available"} onChange={(v) => setEditing({ ...editing, status: v as any })}
              options={[
                { value: "available", label: "Available" }, { value: "reserved", label: "Reserved" },
                { value: "held", label: "Held" }, { value: "sold", label: "Sold" },
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
              <th className="p-3">Cask #</th><th className="p-3">Spirit</th><th className="p-3">Cask</th><th className="p-3">Wood</th>
              <th className="p-3">ABV</th><th className="p-3">OLA</th>
              <th className="p-3">List</th><th className="p-3">Status</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {casks.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-mono">{c.cask_number}</td>
                <td className="p-3">{c.spirit}</td>
                <td className="p-3">{[c.cask_type, c.cask_size_litres != null ? `${c.cask_size_litres}L` : null].filter(Boolean).join(" ") || "—"}</td>
                <td className="p-3">{c.wood ?? "—"}</td>
                <td className="p-3">{c.abv}%</td>
                <td className="p-3">{c.ola_litres}</td>
                <td className="p-3">£{c.list_price?.toLocaleString()}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setEditing(c)} className="text-xs underline mr-3">Edit</button>
                  <button onClick={() => remove(c.id)} className="text-xs text-destructive underline">Delete</button>
                </td>
              </tr>
            ))}
            {casks.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-muted-foreground font-body">No casks yet.</td></tr>}
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
