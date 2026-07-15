import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type ProofOfAddressType, type ProofOfAgeType, type VerificationStatus } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CountrySelect, PhoneField } from "@/components/auth/CountryFields";
import { TitleSelect } from "@/components/auth/TitleSelect";
import { formatName } from "@/lib/formatName";
import { CheckCircle2, Clock, XCircle, Upload, FileText } from "lucide-react";

const ADDRESS_PROOF_TYPES: { value: ProofOfAddressType; label: string }[] = [
  { value: "utility_bill", label: "Utility Bill" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "council_tax", label: "Council Tax / Local Tax Bill" },
  { value: "driving_licence", label: "Driving Licence" },
  { value: "other", label: "Other government-issued letter" },
];

const AGE_PROOF_TYPES: { value: ProofOfAgeType; label: string }[] = [
  { value: "passport", label: "Passport" },
  { value: "driving_licence", label: "Driving Licence" },
  { value: "national_id", label: "National ID Card" },
];

const MAX_FILE_MB = 10;
const ALLOWED_MIMES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export default function Account() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: profile?.title ?? "",
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
      form.title !== (profile.title ?? "") ||
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
    const payload = {
      ...form,
      first_name: formatName(form.first_name),
      last_name: formatName(form.last_name),
    };
    const { error } = await supabase.from("profiles").update(payload).eq("id", profile.id);
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

  const identityLocked = profile?.age_verification_status === "verified";

  return (
    <div className="max-w-2xl">
      <h1 className="display-heading text-4xl mb-8">Account</h1>

      <form onSubmit={saveProfile} className="bg-card border border-border p-8 mb-6 space-y-5">
        <h2 className="display-heading text-xl mb-4">Profile</h2>
        {identityLocked && (
          <p className="font-body text-[11px] text-muted-foreground -mt-2">
            Your legal name and date of birth are locked because your identity has been verified. Contact support to correct them.
          </p>
        )}
        <div className="grid grid-cols-[6rem_1fr_1fr] gap-4">
          {identityLocked ? (
            <Field label="Title" value={form.title} onChange={() => {}} disabled />
          ) : (
            <TitleSelect value={form.title} onChange={(title) => setForm({ ...form, title })} />
          )}
          <Field label="First Name" value={form.first_name} onChange={(v: string) => setForm({ ...form, first_name: v })} disabled={identityLocked} />
          <Field label="Last Name" value={form.last_name} onChange={(v: string) => setForm({ ...form, last_name: v })} disabled={identityLocked} />
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

      <AddressVerificationCard />
      <AgeVerificationCard />

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

function StatusBadge({ status }: { status: VerificationStatus }) {
  const map: Record<VerificationStatus, { label: string; className: string; icon: any }> = {
    not_submitted: { label: "Not submitted", className: "border-border text-muted-foreground", icon: FileText },
    pending: { label: "Pending review", className: "border-amber-500/40 text-amber-600 bg-amber-500/10", icon: Clock },
    verified: { label: "Verified", className: "border-emerald-500/40 text-emerald-600 bg-emerald-500/10", icon: CheckCircle2 },
    rejected: { label: "Rejected", className: "border-destructive/40 text-destructive bg-destructive/10", icon: XCircle },
  };
  const cfg = map[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 border font-body text-[10px] uppercase tracking-[0.2em] ${cfg.className}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

function useSignedUrl(path: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!path) { setUrl(null); return; }
    supabase.storage.from("kyc-documents").createSignedUrl(path, 300).then(({ data }) => {
      if (!cancelled) setUrl(data?.signedUrl ?? null);
    });
    return () => { cancelled = true; };
  }, [path]);
  return url;
}

function AddressVerificationCard() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const status = profile?.address_verification_status ?? "not_submitted";
  const locked = status === "verified" || status === "pending";

  const [addr, setAddr] = useState({
    address_line1: profile?.address_line1 ?? "",
    address_line2: profile?.address_line2 ?? "",
    address_city: profile?.address_city ?? "",
    address_region: profile?.address_region ?? "",
    address_postcode: profile?.address_postcode ?? "",
    address_country: profile?.address_country ?? profile?.country ?? "",
    proof_of_address_type: (profile?.proof_of_address_type ?? "") as ProofOfAddressType | "",
    proof_of_address_issued_on: profile?.proof_of_address_issued_on ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const currentUrl = useSignedUrl(profile?.proof_of_address_path);

  useEffect(() => {
    if (!profile) return;
    setAddr({
      address_line1: profile.address_line1 ?? "",
      address_line2: profile.address_line2 ?? "",
      address_city: profile.address_city ?? "",
      address_region: profile.address_region ?? "",
      address_postcode: profile.address_postcode ?? "",
      address_country: profile.address_country ?? profile.country ?? "",
      proof_of_address_type: (profile.proof_of_address_type ?? "") as ProofOfAddressType | "",
      proof_of_address_issued_on: profile.proof_of_address_issued_on ?? "",
    });
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!addr.address_line1 || !addr.address_city || !addr.address_postcode || !addr.address_country) {
      toast({ title: "Missing address", description: "Please fill in all required address fields.", variant: "destructive" });
      return;
    }
    if (!addr.proof_of_address_type || !addr.proof_of_address_issued_on) {
      toast({ title: "Missing document details", description: "Select a document type and issue date.", variant: "destructive" });
      return;
    }
    const existingPath = profile.proof_of_address_path;
    if (!existingPath && !file) {
      toast({ title: "Upload required", description: "Please attach your proof of address.", variant: "destructive" });
      return;
    }
    setSaving(true);
    let path = existingPath;
    if (file) {
      if (!ALLOWED_MIMES.includes(file.type)) {
        setSaving(false);
        toast({ title: "Unsupported file", description: "Use PDF, JPG, PNG, or WebP.", variant: "destructive" });
        return;
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setSaving(false);
        toast({ title: "File too large", description: `Max ${MAX_FILE_MB}MB.`, variant: "destructive" });
        return;
      }
      setUploading(true);
      const ext = file.name.split(".").pop() || "bin";
      const newPath = `${profile.id}/address-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("kyc-documents").upload(newPath, file, { upsert: false, contentType: file.type });
      setUploading(false);
      if (upErr) {
        setSaving(false);
        toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
        return;
      }
      path = newPath;
    }
    const { error } = await supabase.from("profiles").update({
      ...addr,
      proof_of_address_path: path,
      proof_of_address_type: addr.proof_of_address_type as ProofOfAddressType,
      address_verification_status: "pending",
    }).eq("id", profile.id);
    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    setFile(null);
    toast({ title: "Submitted for review", description: "We'll notify you when your address is verified." });
    await refreshProfile();
  };

  return (
    <section className="bg-card border border-border p-8 mb-6 space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="display-heading text-xl">Address Verification</h2>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Required before your first purchase. Documents must be issued within the last 3 months.
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {status === "rejected" && profile?.verification_notes && (
        <div className="border border-destructive/40 bg-destructive/10 text-destructive font-body text-xs p-3">
          <strong className="uppercase tracking-[0.2em] text-[10px]">Reviewer note:</strong> {profile.verification_notes}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <fieldset disabled={locked} className="space-y-4 disabled:opacity-70">
          <Field label="Address line 1" value={addr.address_line1} onChange={(v: string) => setAddr({ ...addr, address_line1: v })} />
          <Field label="Address line 2 (optional)" value={addr.address_line2} onChange={(v: string) => setAddr({ ...addr, address_line2: v })} />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="City" value={addr.address_city} onChange={(v: string) => setAddr({ ...addr, address_city: v })} />
            <Field label="Region / State" value={addr.address_region} onChange={(v: string) => setAddr({ ...addr, address_region: v })} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Postcode / ZIP" value={addr.address_postcode} onChange={(v: string) => setAddr({ ...addr, address_postcode: v })} />
            <CountrySelect
              value={addr.address_country}
              onChange={(code) => setAddr({ ...addr, address_country: code })}
            />
          </div>

          <div className="pt-4 border-t border-border grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Document type</label>
              <select
                value={addr.proof_of_address_type}
                onChange={(e) => setAddr({ ...addr, proof_of_address_type: e.target.value as ProofOfAddressType })}
                className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary disabled:opacity-60"
              >
                <option value="">Select…</option>
                {ADDRESS_PROOF_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <Field
              label="Issue date"
              type="date"
              value={addr.proof_of_address_issued_on}
              onChange={(v: string) => setAddr({ ...addr, proof_of_address_issued_on: v })}
            />
          </div>

          <div>
            <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
              {profile?.proof_of_address_path ? "Replace document" : "Upload document"}
            </label>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="font-body text-sm w-full"
            />
            <p className="font-body text-[11px] text-muted-foreground mt-1">PDF, JPG, PNG or WebP · max {MAX_FILE_MB}MB</p>
            {currentUrl && (
              <a href={currentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-primary font-body text-xs hover:underline">
                <FileText className="w-3 h-3" /> View current document
              </a>
            )}
          </div>
        </fieldset>

        {!locked && (
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 disabled:opacity-50">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : saving ? "Submitting…" : status === "rejected" ? "Resubmit" : "Submit for review"}
          </button>
        )}
        {locked && status === "pending" && (
          <p className="font-body text-xs text-muted-foreground">Under review — you'll be notified once verified.</p>
        )}
      </form>
    </section>
  );
}

function AgeVerificationCard() {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const status = profile?.age_verification_status ?? "not_submitted";
  const locked = status === "verified" || status === "pending";

  const [dob, setDob] = useState(profile?.date_of_birth ?? "");
  const [docType, setDocType] = useState<ProofOfAgeType | "">((profile?.proof_of_age_type ?? "") as ProofOfAgeType | "");
  const [file, setFile] = useState<File | null>(null);
  const currentUrl = useSignedUrl(profile?.proof_of_age_path);

  useEffect(() => {
    if (!profile) return;
    setDob(profile.date_of_birth ?? "");
    setDocType((profile.proof_of_age_type ?? "") as ProofOfAgeType | "");
  }, [profile]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!dob) return toast({ title: "Missing date of birth", variant: "destructive" });
    const age = (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000);
    if (age < 18) return toast({ title: "Must be 18+", description: "You must be at least 18 to hold a cask.", variant: "destructive" });
    if (!docType) return toast({ title: "Select a document type", variant: "destructive" });
    if (!profile.proof_of_age_path && !file) return toast({ title: "Upload required", description: "Attach your ID document.", variant: "destructive" });

    setSaving(true);
    let path = profile.proof_of_age_path;
    if (file) {
      if (!ALLOWED_MIMES.includes(file.type)) {
        setSaving(false);
        return toast({ title: "Unsupported file", description: "Use PDF, JPG, PNG or WebP.", variant: "destructive" });
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setSaving(false);
        return toast({ title: "File too large", description: `Max ${MAX_FILE_MB}MB.`, variant: "destructive" });
      }
      setUploading(true);
      const ext = file.name.split(".").pop() || "bin";
      const newPath = `${profile.id}/age-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("kyc-documents").upload(newPath, file, { upsert: false, contentType: file.type });
      setUploading(false);
      if (upErr) { setSaving(false); return toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); }
      path = newPath;
    }
    const { error } = await supabase.from("profiles").update({
      date_of_birth: dob,
      proof_of_age_type: docType as ProofOfAgeType,
      proof_of_age_path: path,
      age_verification_status: "pending",
    }).eq("id", profile.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    setFile(null);
    toast({ title: "Submitted for review" });
    await refreshProfile();
  };

  return (
    <section className="bg-card border border-border p-8 mb-6 space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="display-heading text-xl">Date of Birth & ID</h2>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Required before your first purchase. If you use a UK driving licence, it can double as proof of address.
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {status === "rejected" && profile?.verification_notes && (
        <div className="border border-destructive/40 bg-destructive/10 text-destructive font-body text-xs p-3">
          <strong className="uppercase tracking-[0.2em] text-[10px]">Reviewer note:</strong> {profile.verification_notes}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <fieldset disabled={locked} className="space-y-4 disabled:opacity-70">
          <Field label="Date of Birth" type="date" value={dob} onChange={setDob} />
          <div>
            <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Document type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as ProofOfAgeType)}
              className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary disabled:opacity-60"
            >
              <option value="">Select…</option>
              {AGE_PROOF_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
              {profile?.proof_of_age_path ? "Replace document" : "Upload document"}
            </label>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="font-body text-sm w-full"
            />
            <p className="font-body text-[11px] text-muted-foreground mt-1">PDF, JPG, PNG or WebP · max {MAX_FILE_MB}MB</p>
            {currentUrl && (
              <a href={currentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-primary font-body text-xs hover:underline">
                <FileText className="w-3 h-3" /> View current document
              </a>
            )}
          </div>
        </fieldset>

        {!locked && (
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 disabled:opacity-50">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading…" : saving ? "Submitting…" : status === "rejected" ? "Resubmit" : "Submit for review"}
          </button>
        )}
        {locked && status === "pending" && (
          <p className="font-body text-xs text-muted-foreground">Under review — you'll be notified once verified.</p>
        )}
      </form>
    </section>
  );
}

export function VerificationGateBanner() {
  const { profile } = useAuth();
  if (!profile) return null;
  const addr = profile.address_verification_status;
  const age = profile.age_verification_status;
  const done = addr === "verified" && age === "verified";
  if (done) return null;
  return (
    <div className="border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 p-4 mb-6">
      <div className="font-body text-xs uppercase tracking-[0.2em] mb-1">Verification required</div>
      <p className="font-body text-sm">
        You must complete address and identity verification before placing an order.{" "}
        <Link to="/portal/account" className="underline">Complete verification</Link>.
      </p>
    </div>
  );
}
