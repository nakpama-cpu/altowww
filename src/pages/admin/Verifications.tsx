import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, FileText, Clock } from "lucide-react";
import type { VerificationStatus, ProofOfAddressType, ProofOfAgeType } from "@/contexts/AuthContext";

type VProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string | null;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_region: string | null;
  address_postcode: string | null;
  address_country: string | null;
  proof_of_address_path: string | null;
  proof_of_address_type: ProofOfAddressType | null;
  proof_of_address_issued_on: string | null;
  proof_of_age_path: string | null;
  proof_of_age_type: ProofOfAgeType | null;
  address_verification_status: VerificationStatus;
  age_verification_status: VerificationStatus;
  address_verified_at: string | null;
  age_verified_at: string | null;
  verification_notes: string | null;
};

type Tab = "pending" | "verified" | "rejected";

export default function AdminVerifications() {
  const { toast } = useToast();
  const [rows, setRows] = useState<VProfile[]>([]);
  const [tab, setTab] = useState<Tab>("pending");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id,first_name,last_name,email,date_of_birth,address_line1,address_line2,address_city,address_region,address_postcode,address_country,proof_of_address_path,proof_of_address_type,proof_of_address_issued_on,proof_of_age_path,proof_of_age_type,address_verification_status,age_verification_status,address_verified_at,age_verified_at,verification_notes")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast({ title: "Load failed", description: error.message, variant: "destructive" });
    setRows((data ?? []) as VProfile[]);
  };

  useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) => {
    if (tab === "pending") return r.address_verification_status === "pending" || r.age_verification_status === "pending";
    if (tab === "verified") return r.address_verification_status === "verified" && r.age_verification_status === "verified";
    return r.address_verification_status === "rejected" || r.age_verification_status === "rejected";
  });

  return (
    <div className="max-w-6xl">
      <h1 className="display-heading text-4xl mb-2">Verifications</h1>
      <p className="font-body text-sm text-muted-foreground mb-6">Review client address and identity documents.</p>

      <div className="flex gap-2 mb-6">
        {(["pending", "verified", "rejected"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`font-body text-[10px] uppercase tracking-[0.25em] px-4 py-2 border ${tab === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {loading && <p className="font-body text-sm text-muted-foreground">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <div className="bg-card border border-border p-12 text-center font-body text-sm text-muted-foreground">
          Nothing in this tab.
        </div>
      )}

      <div className="space-y-6">
        {filtered.map((p) => <VerificationRow key={p.id} row={p} onChange={load} />)}
      </div>
    </div>
  );
}

function VerificationRow({ row, onChange }: { row: VProfile; onChange: () => void }) {
  const { toast } = useToast();
  const [notes, setNotes] = useState(row.verification_notes ?? "");
  const [busy, setBusy] = useState(false);

  const update = async (patch: Partial<VProfile>) => {
    setBusy(true);
    const { error } = await supabase.from("profiles").update(patch).eq("id", row.id);
    setBusy(false);
    if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
    toast({ title: "Updated" });
    onChange();
  };

  const approveAddress = () => update({ address_verification_status: "verified", address_verified_at: new Date().toISOString() });
  const rejectAddress = () => update({ address_verification_status: "rejected", address_verified_at: null, verification_notes: notes });
  const approveAge = () => update({ age_verification_status: "verified", age_verified_at: new Date().toISOString() });
  const rejectAge = () => update({ age_verification_status: "rejected", age_verified_at: null, verification_notes: notes });

  return (
    <div className="bg-card border border-border p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <div className="display-heading text-xl">{row.first_name} {row.last_name}</div>
          <div className="font-body text-xs text-muted-foreground">{row.email}</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <StatusPill label="Address" status={row.address_verification_status} />
          <StatusPill label="Age" status={row.age_verification_status} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <DocPanel
          title="Proof of Address"
          status={row.address_verification_status}
          docPath={row.proof_of_address_path}
          docType={row.proof_of_address_type ?? "—"}
          extra={
            <>
              <Info label="Issued">{row.proof_of_address_issued_on ?? "—"}</Info>
              <Info label="Address">
                {[row.address_line1, row.address_line2, row.address_city, row.address_region, row.address_postcode, row.address_country].filter(Boolean).join(", ") || "—"}
              </Info>
            </>
          }
          onApprove={approveAddress}
          onReject={rejectAddress}
          busy={busy}
        />
        <DocPanel
          title="Proof of Age"
          status={row.age_verification_status}
          docPath={row.proof_of_age_path}
          docType={row.proof_of_age_type ?? "—"}
          extra={<Info label="Date of Birth">{row.date_of_birth ?? "—"}</Info>}
          onApprove={approveAge}
          onReject={rejectAge}
          busy={busy}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <label className="block font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Reviewer note (shown to client on rejection)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full bg-transparent border border-border p-2 font-body text-sm focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}

function StatusPill({ label, status }: { label: string; status: VerificationStatus }) {
  const map: Record<VerificationStatus, { className: string; icon: any }> = {
    not_submitted: { className: "border-border text-muted-foreground", icon: FileText },
    pending: { className: "border-amber-500/40 text-amber-600 bg-amber-500/10", icon: Clock },
    verified: { className: "border-emerald-500/40 text-emerald-600 bg-emerald-500/10", icon: CheckCircle2 },
    rejected: { className: "border-destructive/40 text-destructive bg-destructive/10", icon: XCircle },
  };
  const cfg = map[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 border font-body text-[10px] uppercase tracking-[0.2em] ${cfg.className}`}>
      <Icon className="w-3 h-3" /> {label}: {status.replace("_", " ")}
    </span>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="font-body text-xs">
      <div className="uppercase tracking-[0.2em] text-[10px] text-muted-foreground mb-0.5">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function DocPanel({ title, status, docPath, docType, extra, onApprove, onReject, busy }: {
  title: string;
  status: VerificationStatus;
  docPath: string | null;
  docType: string;
  extra?: React.ReactNode;
  onApprove: () => void;
  onReject: () => void;
  busy: boolean;
}) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!docPath) { setUrl(null); return; }
    supabase.storage.from("kyc-documents").createSignedUrl(docPath, 300).then(({ data }) => {
      if (!cancelled) setUrl(data?.signedUrl ?? null);
    });
    return () => { cancelled = true; };
  }, [docPath]);

  return (
    <div className="border border-border p-4 space-y-3">
      <div className="display-heading text-base">{title}</div>
      <Info label="Document type">{docType}</Info>
      {extra}
      <div>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary font-body text-xs hover:underline">
            <FileText className="w-3 h-3" /> Open document
          </a>
        ) : (
          <span className="font-body text-xs text-muted-foreground">No document uploaded</span>
        )}
      </div>
      {status !== "not_submitted" && (
        <div className="flex gap-2 pt-2 border-t border-border">
          <button disabled={busy || status === "verified"} onClick={onApprove}
            className="flex-1 font-body text-[10px] uppercase tracking-[0.25em] bg-emerald-600 text-white py-2 hover:opacity-90 disabled:opacity-50">
            Approve
          </button>
          <button disabled={busy || status === "rejected"} onClick={onReject}
            className="flex-1 font-body text-[10px] uppercase tracking-[0.25em] border border-destructive text-destructive py-2 hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50">
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
