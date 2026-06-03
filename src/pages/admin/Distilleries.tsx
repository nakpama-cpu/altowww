import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type D = { id: string; name: string; region: string | null; country: string | null; logo_url: string | null };

export default function AdminDistilleries() {
  const { toast } = useToast();
  const [rows, setRows] = useState<D[]>([]);
  const [form, setForm] = useState({ name: "", region: "", country: "Scotland", logo_url: "" });

  const load = async () => {
    const { data } = await supabase.from("distilleries").select("*").order("name");
    setRows((data ?? []) as D[]);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("distilleries").insert(form);
    if (error) return toast({ title: "Insert failed", description: error.message, variant: "destructive" });
    setForm({ name: "", region: "", country: "Scotland", logo_url: "" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete distillery?")) return;
    const { error } = await supabase.from("distilleries").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else load();
  };

  return (
    <div className="max-w-4xl">
      <h1 className="display-heading text-4xl mb-8">Distilleries</h1>
      <form onSubmit={add} className="bg-card border border-border p-6 mb-8 grid md:grid-cols-5 gap-3 items-end">
        <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Input label="Region" value={form.region} onChange={(v) => setForm({ ...form, region: v })} />
        <Input label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
        <Input label="Logo URL" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} />
        <button type="submit" className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2">Add</button>
      </form>
      <div className="bg-card border border-border">
        {rows.map((d) => (
          <div key={d.id} className="flex items-center justify-between border-b border-border last:border-0 p-4">
            <div>
              <div className="font-body text-sm">{d.name}</div>
              <div className="font-body text-xs text-muted-foreground">{[d.region, d.country].filter(Boolean).join(" · ")}</div>
            </div>
            <button onClick={() => remove(d.id)} className="text-xs text-destructive underline">Delete</button>
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
