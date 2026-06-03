import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const reasons = [
  "Discuss buying additional casks",
  "Discuss selling or bottling a cask",
  "Review my existing portfolio",
  "General enquiry",
];

export default function RequestCallback() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("callback_requests").insert({
      requester_id: user.id,
      reason,
      message: message || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not send request", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
    setReason("");
    setMessage("");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="display-heading text-4xl mb-2">Request a Callback</h1>
      <p className="font-body text-sm text-muted-foreground mb-8">
        A Portfolio Advisor will call you back within one business day.
      </p>

      {sent && (
        <div className="bg-primary/5 border border-primary/30 p-6 mb-8">
          <p className="font-body text-sm">Your request has been received. We'll be in touch shortly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border p-8">
        <div>
          <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Reason</label>
          <select required value={reason} onChange={(e) => setReason(e.target.value)}
            className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary">
            <option value="" disabled>Select a reason…</option>
            {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Message (optional)</label>
          <textarea rows={4} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary resize-none" />
        </div>
        <button type="submit" disabled={submitting}
          className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-3 hover:opacity-90 disabled:opacity-50">
          {submitting ? "Sending…" : "Request Callback"}
        </button>
      </form>
    </div>
  );
}
