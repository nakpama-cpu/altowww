import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type LinkItem = { title?: string; name?: string; url?: string };

type D = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  logo_url: string | null;
  image_url: string | null;
  founded_by: string | null;
  founded_year: number | null;
  famous_for: string | null;
  region_character: string | null;
  annual_production: string | null;
  export_markets: string | null;
  owner: string | null;
  website_url: string | null;
  visitor_centre: string | null;
  about: string | null;
  news: LinkItem[] | null;
  awards: LinkItem[] | null;
};

type FormState = {
  name: string;
  region: string;
  country: string;
  logo_url: string;
  image_url: string;
  founded_by: string;
  founded_year: string;
  famous_for: string;
  region_character: string;
  annual_production: string;
  export_markets: string;
  owner: string;
  website_url: string;
  visitor_centre: string;
  about: string;
  news: LinkItem[];
  awards: LinkItem[];
};

const emptyForm = (): FormState => ({
  name: "", region: "", country: "Scotland", logo_url: "", image_url: "",
  founded_by: "", founded_year: "", famous_for: "", region_character: "",
  annual_production: "", export_markets: "", owner: "", website_url: "",
  visitor_centre: "", about: "", news: [], awards: [],
});

const toPayload = (f: FormState) => ({
  name: f.name,
  region: f.region || null,
  country: f.country || null,
  logo_url: f.logo_url || null,
  image_url: f.image_url || null,
  founded_by: f.founded_by || null,
  founded_year: f.founded_year ? Number(f.founded_year) : null,
  famous_for: f.famous_for || null,
  region_character: f.region_character || null,
  annual_production: f.annual_production || null,
  export_markets: f.export_markets || null,
  owner: f.owner || null,
  website_url: f.website_url || null,
  visitor_centre: f.visitor_centre || null,
  about: f.about || null,
  news: f.news.filter((n) => (n.title ?? "").trim() || (n.url ?? "").trim()),
  awards: f.awards.filter((a) => (a.name ?? "").trim() || (a.url ?? "").trim()),
});

const fromRow = (d: D): FormState => ({
  name: d.name ?? "",
  region: d.region ?? "",
  country: d.country ?? "",
  logo_url: d.logo_url ?? "",
  image_url: d.image_url ?? "",
  founded_by: d.founded_by ?? "",
  founded_year: d.founded_year != null ? String(d.founded_year) : "",
  famous_for: d.famous_for ?? "",
  region_character: d.region_character ?? "",
  annual_production: d.annual_production ?? "",
  export_markets: d.export_markets ?? "",
  owner: d.owner ?? "",
  website_url: d.website_url ?? "",
  visitor_centre: d.visitor_centre ?? "",
  about: d.about ?? "",
  news: Array.isArray(d.news) ? d.news : [],
  awards: Array.isArray(d.awards) ? d.awards : [],
});

export default function AdminDistilleries() {
  const { toast } = useToast();
  const [rows, setRows] = useState<D[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<FormState>(emptyForm());

  const load = async () => {
    const { data } = await supabase.from("distilleries").select("*").order("name");
    setRows((data ?? []) as D[]);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("distilleries").insert(toPayload(form));
    if (error) return toast({ title: "Insert failed", description: error.message, variant: "destructive" });
    setForm(emptyForm());
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
    setEdit(fromRow(d));
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("distilleries").update(toPayload(edit)).eq("id", editingId);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    setEditingId(null);
    setEdit(emptyForm());
    load();
  };

  const renderEditor = (state: FormState, setState: (s: FormState) => void) => (
    <div className="grid md:grid-cols-2 gap-3">
      <Input label="Name" value={state.name} onChange={(v) => setState({ ...state, name: v })} required />
      <Input label="Region" value={state.region} onChange={(v) => setState({ ...state, region: v })} />
      <Input label="Country" value={state.country} onChange={(v) => setState({ ...state, country: v })} />
      <Input label="Owner / parent company" value={state.owner} onChange={(v) => setState({ ...state, owner: v })} />
      <Input label="Founded by" value={state.founded_by} onChange={(v) => setState({ ...state, founded_by: v })} />
      <Input label="Founded year" value={state.founded_year} onChange={(v) => setState({ ...state, founded_year: v })} type="number" />
      <Input label="Logo URL (carousel)" value={state.logo_url} onChange={(v) => setState({ ...state, logo_url: v })} />
      <Input label="Banner image URL (modal)" value={state.image_url} onChange={(v) => setState({ ...state, image_url: v })} />
      <Input label="Website URL" value={state.website_url} onChange={(v) => setState({ ...state, website_url: v })} />
      <Input label="Visitor centre" value={state.visitor_centre} onChange={(v) => setState({ ...state, visitor_centre: v })} />
      <Input label="Famous for" value={state.famous_for} onChange={(v) => setState({ ...state, famous_for: v })} className="md:col-span-2" />
      <Input label="Region character" value={state.region_character} onChange={(v) => setState({ ...state, region_character: v })} className="md:col-span-2" />
      <Input label="Annual production" value={state.annual_production} onChange={(v) => setState({ ...state, annual_production: v })} />
      <Input label="Key export markets" value={state.export_markets} onChange={(v) => setState({ ...state, export_markets: v })} />
      <TextArea label="About" value={state.about} onChange={(v) => setState({ ...state, about: v })} className="md:col-span-2" />
      <LinkListEditor
        label="News (Title + URL)"
        keyA="title"
        items={state.news}
        onChange={(items) => setState({ ...state, news: items })}
      />
      <LinkListEditor
        label="Awards (Name + Organisation URL)"
        keyA="name"
        items={state.awards}
        onChange={(items) => setState({ ...state, awards: items })}
      />
    </div>
  );

  return (
    <div className="max-w-4xl">
      <h1 className="display-heading text-4xl mb-8">Distilleries</h1>
      <form onSubmit={add} className="bg-card border border-border p-6 mb-8">
        {renderEditor(form, setForm)}
        <button type="submit" className="mt-4 font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-4 py-2">Add Distillery</button>
      </form>
      <div className="bg-card border border-border">
        {rows.map((d) => (
          <div key={d.id} className="border-b border-border last:border-0 p-4">
            {editingId === d.id ? (
              <div className="space-y-4">
                {renderEditor(edit, setEdit)}
                <div className="flex gap-3">
                  <button onClick={saveEdit} className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-4 py-2">Save</button>
                  <button onClick={() => { setEditingId(null); setEdit(emptyForm()); }} className="font-body text-xs uppercase tracking-[0.25em] border border-border px-4 py-2">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-body text-sm">{d.name}</div>
                  <div className="font-body text-xs text-muted-foreground">{[d.region, d.country, d.founded_year && `est. ${d.founded_year}`].filter(Boolean).join(" · ")}</div>
                  {d.about && <div className="font-body text-xs text-muted-foreground mt-2 line-clamp-2">{d.about}</div>}
                  <div className="font-body text-xs text-muted-foreground mt-1">
                    {(d.news?.length ?? 0)} news · {(d.awards?.length ?? 0)} awards
                  </div>
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

const Input = ({ label, value, onChange, required, type, className }: any) => (
  <div className={className}>
    <label className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</label>
    <input required={required} type={type ?? "text"} value={value} onChange={(e) => onChange(e.target.value)}
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

const LinkListEditor = ({
  label, keyA, items, onChange,
}: {
  label: string;
  keyA: "title" | "name";
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
}) => {
  const update = (i: number, patch: Partial<LinkItem>) => {
    const next = items.slice();
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  return (
    <div className="md:col-span-2 border border-border p-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              placeholder={keyA === "title" ? "Title" : "Name"}
              value={(item[keyA] as string) ?? ""}
              onChange={(e) => update(i, { [keyA]: e.target.value })}
              className="flex-1 bg-transparent border border-border px-2 py-1 text-sm"
            />
            <input
              placeholder="https://..."
              value={item.url ?? ""}
              onChange={(e) => update(i, { url: e.target.value })}
              className="flex-1 bg-transparent border border-border px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="text-xs text-destructive underline shrink-0"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, { [keyA]: "", url: "" } as LinkItem])}
        className="mt-2 font-body text-[10px] uppercase tracking-[0.2em] border border-border px-3 py-1.5"
      >
        + Add row
      </button>
    </div>
  );
};
