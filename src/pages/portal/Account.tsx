import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type ProofOfAddressType, type ProofOfAgeType, type VerificationStatus } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CountrySelect, PhoneField } from "@/components/auth/CountryFields";
import { CheckCircle2, Clock, XCircle, ShieldCheck, Pencil, FileText, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TablesUpdate } from "@/integrations/supabase/types";

type ProfileUpdate = TablesUpdate<"profiles">;

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

function formatDob(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

function formatAddress(p: {
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_region: string | null;
  address_postcode: string | null;
  address_country: string | null;
}) {
  const parts = [p.address_line1, p.address_line2, p.address_city, p.address_region, p.address_postcode, p.address_country]
    .filter((x) => x && String(x).trim().length > 0);
  return parts.length ? parts.join(", ") : "—";
}

function formatPhone(profile: { phone_country_code: string | null; phone: string | null }) {
  const code = profile.phone_country_code?.trim() ?? "";
  const num = profile.phone?.trim() ?? "";
  if (!num) return "—";
  return code ? `${code} ${num}` : num;
}

function StatusPill({ status }: { status: VerificationStatus }) {
  const map: Record<VerificationStatus, { label: string; className: string; Icon: any }> = {
    not_submitted: { label: "Not submitted", className: "border-border text-muted-foreground", Icon: FileText },
    pending: { label: "Pending review", className: "border-amber-500/40 text-amber-600 bg-amber-500/10", Icon: Clock },
    verified: { label: "Verified", className: "border-emerald-500/40 text-emerald-700 bg-emerald-500/10", Icon: CheckCircle2 },
    rejected: { label: "Rejected", className: "border-destructive/40 text-destructive bg-destructive/10", Icon: XCircle },
  };
  const cfg = map[status];
  const Icon = cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 border font-body text-[10px] uppercase tracking-[0.2em] ${cfg.className}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

function RowStatus({
  status,
  onVerify,
}: {
  status: VerificationStatus;
  onVerify: () => void;
}) {
  if (status === "pending" || status === "verified") return <StatusPill status={status} />;
  return (
    <button
      type="button"
      onClick={onVerify}
      className={`font-body text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border transition-colors ${
        status === "rejected"
          ? "border-destructive text-destructive hover:bg-destructive/10"
          : "border-primary text-primary hover:bg-primary/10"
      }`}
    >
      {status === "rejected" ? "Resubmit" : "Verify"}
    </button>
  );
}

export default function Account() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [addressOpen, setAddressOpen] = useState(false);
  const [dobOpen, setDobOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [password, setPassword] = useState("");

  if (!profile) return null;

  const addrStatus = profile.address_verification_status;
  const ageStatus = profile.age_verification_status;
  const fullyVerified = addrStatus === "verified" && ageStatus === "verified";
  const displayName = [profile.title, profile.first_name, profile.last_name].filter(Boolean).join(" ");

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

      {fullyVerified && (
        <div className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 p-3 mb-6 flex items-center gap-2 font-body text-xs">
          <ShieldCheck className="w-4 h-4" /> Verified account — you're cleared to purchase.
        </div>
      )}

      <section className="bg-card border border-border p-8 mb-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="display-heading text-xl">Profile</h2>
            {fullyVerified && (
              <span className="inline-flex items-center gap-1.5 px-2 py-1 border border-emerald-500/40 text-emerald-700 bg-emerald-500/10 font-body text-[10px] uppercase tracking-[0.2em]">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-1.5 font-body text-[10px] uppercase tracking-[0.25em] border border-border px-3 py-1.5 hover:bg-muted"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
        </div>

        <dl className="divide-y divide-border">
          <ProfileRow label="Name" value={displayName || "—"} />
          <ProfileRow
            label="Date of birth"
            value={formatDob(profile.date_of_birth)}
            action={<RowStatus status={ageStatus} onVerify={() => setDobOpen(true)} />}
          />
          <ProfileRow label="Email" value={profile.email} />
          <ProfileRow
            label="Address"
            value={formatAddress(profile)}
            action={<RowStatus status={addrStatus} onVerify={() => setAddressOpen(true)} />}
          />
          <ProfileRow label="Contact number" value={formatPhone(profile)} />
        </dl>

        {(addrStatus === "rejected" || ageStatus === "rejected") && profile.verification_notes && (
          <div className="mt-5 border border-destructive/40 bg-destructive/10 text-destructive font-body text-xs p-3">
            <strong className="uppercase tracking-[0.2em] text-[10px] block mb-1">Reviewer note</strong>
            {profile.verification_notes}
          </div>
        )}
      </section>

      <form onSubmit={changePassword} className="bg-card border border-border p-8 space-y-5">
        <h2 className="display-heading text-xl mb-4">Change Password</h2>
        <div>
          <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="font-body text-xs uppercase tracking-[0.25em] border border-border px-8 py-3 hover:bg-muted"
        >
          Update Password
        </button>
      </form>

      <VerifyAddressDialog open={addressOpen} onOpenChange={setAddressOpen} />
      <VerifyDobDialog open={dobOpen} onOpenChange={setDobOpen} />
      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}

function ProfileRow({ label, value, action }: { label: string; value: string; action?: React.ReactNode }) {
  return (
    <div className="py-4 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</div>
        <div className="font-body text-sm text-foreground break-words">{value}</div>
      </div>
      {action && <div className="flex-shrink-0 pt-1">{action}</div>}
    </div>
  );
}

// ─── Verify Address Dialog ─────────────────────────────────────────────────

function VerifyAddressDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [addr, setAddr] = useState({
    address_line1: "",
    address_line2: "",
    address_city: "",
    address_region: "",
    address_postcode: "",
    address_country: "",
    proof_of_address_type: "" as ProofOfAddressType | "",
    proof_of_address_issued_on: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [useForAge, setUseForAge] = useState(false);

  useEffect(() => {
    if (!open || !profile) return;
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
    setFile(null);
    setUseForAge(false);
  }, [open, profile]);

  const ageAlreadyVerified = profile?.age_verification_status === "verified";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!addr.address_line1 || !addr.address_city || !addr.address_postcode || !addr.address_country) {
      return toast({ title: "Missing address", description: "Please complete all required address fields.", variant: "destructive" });
    }
    if (!addr.proof_of_address_type || !addr.proof_of_address_issued_on) {
      return toast({ title: "Missing document details", description: "Select a document type and issue date.", variant: "destructive" });
    }
    if (!file && !profile.proof_of_address_path) {
      return toast({ title: "Upload required", description: "Please attach your proof of address.", variant: "destructive" });
    }

    setSaving(true);
    let path = profile.proof_of_address_path;
    if (file) {
      if (!ALLOWED_MIMES.includes(file.type)) {
        setSaving(false);
        return toast({ title: "Unsupported file", description: "Use PDF, JPG, PNG or WebP.", variant: "destructive" });
      }
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        setSaving(false);
        return toast({ title: "File too large", description: `Max ${MAX_FILE_MB}MB.`, variant: "destructive" });
      }
      const ext = file.name.split(".").pop() || "bin";
      const newPath = `${profile.id}/address-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("kyc-documents").upload(newPath, file, { upsert: false, contentType: file.type });
      if (upErr) {
        setSaving(false);
        return toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      }
      path = newPath;
    }

    const dualUse = useForAge && addr.proof_of_address_type === "driving_licence" && !ageAlreadyVerified;
    const update: ProfileUpdate = {
      ...addr,
      proof_of_address_path: path,
      proof_of_address_type: addr.proof_of_address_type as ProofOfAddressType,
      address_verification_status: "pending",
    };
    if (dualUse) {
      update.proof_of_age_path = path;
      update.proof_of_age_type = "driving_licence";
      update.age_verification_status = "pending";
    }

    const { error } = await supabase.from("profiles").update(update).eq("id", profile.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({
      title: "Submitted for review",
      description: "We'll review your documents within 24 hours and let you know by email.",
    });
    await refreshProfile();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[calc(100vw-1.5rem)] p-4 sm:p-5 gap-3 max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="display-heading text-xl">Verify your address</DialogTitle>
          <DialogDescription>
            Enter your current address and upload a document issued within the last 3 months.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-2.5">
          <TextField label="Address line 1" value={addr.address_line1} onChange={(v) => setAddr({ ...addr, address_line1: v })} />
          <TextField label="Address line 2 (optional)" value={addr.address_line2} onChange={(v) => setAddr({ ...addr, address_line2: v })} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="City" value={addr.address_city} onChange={(v) => setAddr({ ...addr, address_city: v })} />
            <TextField label="Region / State" value={addr.address_region} onChange={(v) => setAddr({ ...addr, address_region: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Postcode / ZIP" value={addr.address_postcode} onChange={(v) => setAddr({ ...addr, address_postcode: v })} />
            <CountrySelect value={addr.address_country} onChange={(code) => setAddr({ ...addr, address_country: code })} />
          </div>

          <div className="pt-2 border-t border-border grid grid-cols-2 gap-3">
            <div>
              <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Document type</label>
              <select
                value={addr.proof_of_address_type}
                onChange={(e) => setAddr({ ...addr, proof_of_address_type: e.target.value as ProofOfAddressType })}
                className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
              >
                <option value="">Select…</option>
                {ADDRESS_PROOF_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <TextField
              label="Issue date"
              type="date"
              value={addr.proof_of_address_issued_on}
              onChange={(v) => setAddr({ ...addr, proof_of_address_issued_on: v })}
            />
          </div>

          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Upload document</label>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="font-body text-xs w-full"
            />
            <p className="font-body text-[10px] text-muted-foreground mt-0.5">PDF, JPG, PNG or WebP · max {MAX_FILE_MB}MB</p>
          </div>

          {addr.proof_of_address_type === "driving_licence" && !ageAlreadyVerified && (
            <label className="flex items-start gap-2 p-3 border border-border bg-muted/30 cursor-pointer">
              <input
                type="checkbox"
                checked={useForAge}
                onChange={(e) => setUseForAge(e.target.checked)}
                className="mt-0.5"
              />
              <span className="font-body text-xs text-foreground">
                Use this driving licence as proof of age as well. You won't need to upload a second document.
              </span>
            </label>
          )}

          <DialogFooter>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-5 py-2 hover:opacity-90 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" /> {saving ? "Submitting…" : "Submit for review"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Verify DOB Dialog ─────────────────────────────────────────────────────

function VerifyDobDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [dob, setDob] = useState("");
  const [docType, setDocType] = useState<ProofOfAgeType | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [useForAddress, setUseForAddress] = useState(false);
  const [issuedOn, setIssuedOn] = useState("");

  useEffect(() => {
    if (!open || !profile) return;
    setDob(profile.date_of_birth ?? "");
    setDocType((profile.proof_of_age_type ?? "") as ProofOfAgeType | "");
    setFile(null);
    setUseForAddress(false);
    setIssuedOn("");
  }, [open, profile]);

  const addressAlreadyVerified = profile?.address_verification_status === "verified";
  const hasAddressOnFile = !!(profile?.address_line1 && profile?.address_postcode);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!dob) return toast({ title: "Missing date of birth", variant: "destructive" });
    const age = (Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000);
    if (age < 18) return toast({ title: "Must be 18+", description: "You must be at least 18 to hold a cask.", variant: "destructive" });
    if (!docType) return toast({ title: "Select a document type", variant: "destructive" });
    if (!file && !profile.proof_of_age_path) return toast({ title: "Upload required", description: "Attach your ID document.", variant: "destructive" });

    const dualUse = useForAddress && docType === "driving_licence" && !addressAlreadyVerified;
    if (dualUse && (!hasAddressOnFile || !issuedOn)) {
      return toast({
        title: "Address details needed",
        description: "To use this licence for address proof, add your address (via Edit) and set the issue date.",
        variant: "destructive",
      });
    }

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
      const ext = file.name.split(".").pop() || "bin";
      const newPath = `${profile.id}/age-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("kyc-documents").upload(newPath, file, { upsert: false, contentType: file.type });
      if (upErr) {
        setSaving(false);
        return toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
      }
      path = newPath;
    }

    const update: ProfileUpdate = {
      date_of_birth: dob,
      proof_of_age_type: docType as ProofOfAgeType,
      proof_of_age_path: path,
      age_verification_status: "pending",
    };
    if (dualUse) {
      update.proof_of_address_path = path;
      update.proof_of_address_type = "driving_licence";
      update.proof_of_address_issued_on = issuedOn;
      update.address_verification_status = "pending";
    }

    const { error } = await supabase.from("profiles").update(update).eq("id", profile.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({
      title: "Submitted for review",
      description: "We'll review your documents within 24 hours and let you know by email.",
    });
    await refreshProfile();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[calc(100vw-1.5rem)] p-4 sm:p-5 gap-3 max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="display-heading text-xl">Verify your date of birth</DialogTitle>
          <DialogDescription>
            Confirm your date of birth and upload a government-issued ID.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-2.5">
          <TextField label="Date of birth" type="date" value={dob} onChange={setDob} />

          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Document type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as ProofOfAgeType)}
              className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
            >
              <option value="">Select…</option>
              {AGE_PROOF_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Upload document</label>
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="font-body text-xs w-full"
            />
            <p className="font-body text-[10px] text-muted-foreground mt-0.5">PDF, JPG, PNG or WebP · max {MAX_FILE_MB}MB</p>
          </div>

          {docType === "driving_licence" && !addressAlreadyVerified && (
            <div className="p-3 border border-border bg-muted/30 space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useForAddress}
                  onChange={(e) => setUseForAddress(e.target.checked)}
                  className="mt-0.5"
                />
                <span className="font-body text-xs text-foreground">
                  Use this driving licence as proof of address as well {hasAddressOnFile ? "" : "(add your address via Edit first)"}.
                </span>
              </label>
              {useForAddress && hasAddressOnFile && (
                <TextField label="Licence issue date" type="date" value={issuedOn} onChange={setIssuedOn} />
              )}
            </div>
          )}

          <DialogFooter>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-5 py-2 hover:opacity-90 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" /> {saving ? "Submitting…" : "Submit for review"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit Profile Dialog (address + phone) ─────────────────────────────────

function EditProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"phone" | "address">("phone");
  const [saving, setSaving] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [country, setCountry] = useState("");

  const [addr, setAddr] = useState({
    address_line1: "",
    address_line2: "",
    address_city: "",
    address_region: "",
    address_postcode: "",
    address_country: "",
    proof_of_address_type: "" as ProofOfAddressType | "",
    proof_of_address_issued_on: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open || !profile) return;
    setTab("phone");
    setPhone(profile.phone ?? "");
    setPhoneCode(profile.phone_country_code ?? "");
    setCountry(profile.country ?? "");
    setAddr({
      address_line1: profile.address_line1 ?? "",
      address_line2: profile.address_line2 ?? "",
      address_city: profile.address_city ?? "",
      address_region: profile.address_region ?? "",
      address_postcode: profile.address_postcode ?? "",
      address_country: profile.address_country ?? profile.country ?? "",
      proof_of_address_type: "",
      proof_of_address_issued_on: "",
    });
    setFile(null);
  }, [open, profile]);

  const phoneChanged = useMemo(() => {
    if (!profile) return false;
    return phone !== (profile.phone ?? "") || phoneCode !== (profile.phone_country_code ?? "") || country !== (profile.country ?? "");
  }, [phone, phoneCode, country, profile]);

  const savePhone = async () => {
    if (!profile || !phoneChanged) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ phone, phone_country_code: phoneCode, country })
      .eq("id", profile.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Contact number updated" });
    await refreshProfile();
    onOpenChange(false);
  };

  const saveAddress = async () => {
    if (!profile) return;
    if (!addr.address_line1 || !addr.address_city || !addr.address_postcode || !addr.address_country) {
      return toast({ title: "Missing address", description: "Please complete all required address fields.", variant: "destructive" });
    }
    if (!addr.proof_of_address_type || !addr.proof_of_address_issued_on) {
      return toast({ title: "Missing document details", description: "Select a document type and issue date for your new proof of address.", variant: "destructive" });
    }
    if (!file) {
      return toast({ title: "New proof required", description: "Please upload a new proof of address to re-verify.", variant: "destructive" });
    }
    if (!ALLOWED_MIMES.includes(file.type)) {
      return toast({ title: "Unsupported file", description: "Use PDF, JPG, PNG or WebP.", variant: "destructive" });
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return toast({ title: "File too large", description: `Max ${MAX_FILE_MB}MB.`, variant: "destructive" });
    }

    setSaving(true);
    const ext = file.name.split(".").pop() || "bin";
    const newPath = `${profile.id}/address-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("kyc-documents").upload(newPath, file, { upsert: false, contentType: file.type });
    if (upErr) {
      setSaving(false);
      return toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        ...addr,
        proof_of_address_path: newPath,
        proof_of_address_type: addr.proof_of_address_type as ProofOfAddressType,
        address_verification_status: "pending",
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({
      title: "Address submitted for re-verification",
      description: "We'll review your new documents within 24 hours.",
    });
    await refreshProfile();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[calc(100vw-1.5rem)] p-4 sm:p-5 gap-3 max-h-[calc(100dvh-1.5rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="display-heading text-xl">Edit profile</DialogTitle>
          <DialogDescription>Update your contact number or address. Name, date of birth and email are locked for identity purposes.</DialogDescription>
        </DialogHeader>

        <div className="flex border-b border-border">
          <TabButton active={tab === "phone"} onClick={() => setTab("phone")}>Contact number</TabButton>
          <TabButton active={tab === "address"} onClick={() => setTab("address")}>Address</TabButton>
        </div>

        {tab === "phone" ? (
          <div className="space-y-2.5 pt-1">
            <CountrySelect value={country} onChange={(code, dialingCode) => { setCountry(code); setPhoneCode(dialingCode); }} />
            <PhoneField
              countryCode={phoneCode}
              onCountryCodeChange={setPhoneCode}
              phone={phone}
              onPhoneChange={setPhone}
            />
            <DialogFooter>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="font-body text-xs uppercase tracking-[0.25em] border border-border px-5 py-2 hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={savePhone}
                disabled={saving || !phoneChanged}
                className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-5 py-2 hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            <div className="border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 p-3 font-body text-xs">
              Changing your address requires re-verification. Please upload a new proof of address issued within the last 3 months.
            </div>
            <TextField label="Address line 1" value={addr.address_line1} onChange={(v) => setAddr({ ...addr, address_line1: v })} />
            <TextField label="Address line 2 (optional)" value={addr.address_line2} onChange={(v) => setAddr({ ...addr, address_line2: v })} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="City" value={addr.address_city} onChange={(v) => setAddr({ ...addr, address_city: v })} />
              <TextField label="Region / State" value={addr.address_region} onChange={(v) => setAddr({ ...addr, address_region: v })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Postcode / ZIP" value={addr.address_postcode} onChange={(v) => setAddr({ ...addr, address_postcode: v })} />
              <CountrySelect value={addr.address_country} onChange={(code) => setAddr({ ...addr, address_country: code })} />
            </div>
            <div className="pt-2 border-t border-border grid grid-cols-2 gap-3">
              <div>
                <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Document type</label>
                <select
                  value={addr.proof_of_address_type}
                  onChange={(e) => setAddr({ ...addr, proof_of_address_type: e.target.value as ProofOfAddressType })}
                  className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">Select…</option>
                  {ADDRESS_PROOF_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <TextField
                label="Issue date"
                type="date"
                value={addr.proof_of_address_issued_on}
                onChange={(v) => setAddr({ ...addr, proof_of_address_issued_on: v })}
              />
            </div>
            <div>
              <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Upload new proof of address</label>
              <input
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="font-body text-xs w-full"
              />
              <p className="font-body text-[10px] text-muted-foreground mt-0.5">PDF, JPG, PNG or WebP · max {MAX_FILE_MB}MB</p>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="font-body text-xs uppercase tracking-[0.25em] border border-border px-5 py-2 hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAddress}
                disabled={saving}
                className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-5 py-2 hover:opacity-90 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" /> {saving ? "Submitting…" : "Save & re-verify"}
              </button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-body text-[10px] uppercase tracking-[0.25em] px-4 py-3 border-b-2 -mb-px transition-colors ${
        active ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
      />
    </div>
  );
}

export function VerificationGateBanner() {
  const { profile } = useAuth();
  if (!profile) return null;
  const done = profile.address_verification_status === "verified" && profile.age_verification_status === "verified";
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
