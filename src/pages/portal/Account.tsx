import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CountrySelect, PhoneField } from "@/components/auth/CountryFields";

export default function Account() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    first_name: profile?.first_name ?? "",
    last_name: profile?.last_name ?? "",
    phone: profile?.phone ?? "",
    phone_country_code: profile?.phone_country_code ?? "",
    country: profile?.country ?? "",
  });
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const changed = useMemo(() => {
    if (!profile) return false;
    return (
      form.first_name !== (profile.first_name ?? "") ||
      form.last_name !== (profile.last_name ?? "") ||
      form.phone !== (profile.phone ?? "") ||
      form.phone_country_code !== (profile.phone_country_code ?? "") ||
      form.country !== (profile.country ?? "")
    );
  }, [form, profile]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", profile.id);
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Profile updated" });
      await refreshProfile();
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) toast({ title: "Could not update", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Password updated" });
      setPassword("");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="display-heading text-4xl mb-8">Account</h1>

      <form onSubmit={saveProfile} className="bg-card border border-border p-8 mb-6 space-y-5">
        <h2 className="display-heading text-xl mb-4">Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" value={form.first_name} onChange={(v: string) => setForm({ ...form, first_name: v })} />
          <Field label="Last Name" value={form.last_name} onChange={(v: string) => setForm({ ...form, last_name: v })} />
        </div>
        <Field label="Email" value={profile?.email ?? ""} onChange={() => {}} disabled />
        <CountrySelect
          value={form.country}
          onChange={(code, dialingCode) =>
            setForm((f) => ({ ...f, country: code, phone_country_code: dialingCode }))
          }
        />
        <PhoneField
          countryCode={form.phone_country_code}
          onCountryCodeChange={(phone_country_code) => setForm({ ...form, phone_country_code })}
          phone={form.phone}
          onPhoneChange={(phone) => setForm({ ...form, phone })}
        />
        <button type="submit" disabled={saving || !changed}
          className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 disabled:opacity-50">
          {saving ? "Saving…" : "Save"}
        </button>
      </form>

      <form onSubmit={changePassword} className="bg-card border border-border p-8 space-y-5">
        <h2 className="display-heading text-xl mb-4">Change Password</h2>
        <Field label="New Password" type="password" value={password} onChange={setPassword} />
        <button type="submit"
          className="font-body text-xs uppercase tracking-[0.25em] border border-border px-8 py-3 hover:bg-muted">
          Update Password
        </button>
      </form>
    </div>
  );
}

const Field = ({ label, value, onChange, type = "text", disabled = false }: any) => (
  <div>
    <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
      className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary disabled:opacity-60" />
  </div>
);
