import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type D = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  logo_url: string | null;
  about: string | null;
  awards: string | null;
};

export default function AdminDistilleries() {
  const { toast } = useToast();
  const [rows, setRows] = useState<D[]>([]);
  const [form, setForm] = useState({ name: "", region: "", country: "Scotland", logo_url: "", about: "", awards: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<D>>({});

  const load = async () => {
    const { data } = await supabase.from("distilleries").select("*").order("name");
    setRows((data ?? []) as D[]);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("distilleries").insert(form);
    if (error) return toast({ title: "Insert failed", description: error.message, variant: "destructive" });
    setForm({ name: "", region: "", country: "Scotland", logo_url: "", about: "", awards: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete distillery?")) return;
    const { error } = await supabase.from("distilleries").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else load();
  };

  const startEdit = (d: D) => {
    setEditingId(d.id);
    setEdit({ name: d.name, region: d.region, country: d.country, logo_url: d.logo_url, about: d.about, awards: d.awards });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("distilleries").update(edit).eq("id", editingId);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    setEditingId(null);
    setEdit({});
    load();
  };

  return (
    <div className="max-w-4xl">
      <h1 className="display-heading text-4xl mb-8">Distilleries</h1>
      <form onSubmit={add} className="bg-card border border-border p-6 mb-8 grid md:grid-cols-2 gap-3">
        <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Input label="Region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} />
        <Input label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
        <Input label="Logo URL" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} />
        <TextArea label="About" value={form.about} onChange={(v) => setForm({ ...form, about: v })} className="md:col-span-2" />
        <TextArea label="Awards (one per line)" value={form.awards} onChange={(v) => setForm({ ...form, awards: v })} className="md:col-span-2" />
        <button type="submit" className="md:col-span-2 font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2">Add</button>
      </form>
      <div className="bg-card border border-border">
        {rows.map((d) => (
          <div key={d.id} className="border-b border-border last:border-0 p-4">
            {editingId === d.id ? (
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="Name" value={edit.name ?? ""} onChange={(v) => setEdit({ ...edit, name: v })} />
                <Input label="Region" value={edit.region ?? ""} onChange={(v) => setEdit({ ...edit, region: v })} />
                <Input label="Country" value={edit.country ?? ""} onChange={(v) => setEdit({ ...edit, country: v })} />
                <Input label="Logo URL" value={edit.logo_url ?? ""} onChange={(v) => setEdit({ ...edit, logo_url: v })} />
                <TextArea label="About" value={edit.about ?? ""} onChange={(v) => setEdit({ ...edit, about: v })} className="md:col-span-2" />
                <TextArea label="Awards (one per line)" value={edit.awards ?? ""} onChange={(v) => setEdit({ ...edit, awards: v })} className="md:col-span-2" />
                <div className="md:col-span-2 flex gap-3">
                  <button onClick={saveEdit} className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-4 py-2">Save</button>
                  <button onClick={() => { setEditingId(null); setEdit({}); }} className="font-body text-xs uppercase tracking-[0.25em] border border-border px-4 py-2">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-body text-sm">{d.name}</div>
                  <div className="font-body text-xs text-muted-foreground">{[d.region, d.country].filter(Boolean).join(" · ")}</div>
                  {d.about && <div className="font-body text-xs text-muted-foreground mt-2 line-clamp-2">{d.about}</div>}
                  {d.awards && <div className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">Awards: {d.awards.replace(/\n/g, " · ")}</div>}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button onClick={() => startEdit(d)} className="text-xs underline">Edit</button>
                  <button onClick={() => remove(d.id)} className="text-xs text-destructive underline">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {rows.length === 0 && <p className="p-8 text-center text-muted-foreground font-body text-sm">No distilleries yet.</p>}
      </div>
    </div>
  );
}

const Input = ({ label, value, onChange, required }: any) => (
  <div>
    <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</label>
    <input required={required} value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent border border-border px-2 py-1 text-sm" />
  </div>
);

const TextArea = ({ label, value, onChange, className }: any) => (
  <div className={className}>
    <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}
      className="w-full bg-transparent border border-border px-2 py-1 text-sm" />
  </div>
);
