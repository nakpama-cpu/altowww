import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthShell from "@/components/auth/AuthShell";
import Seo from "@/components/Seo";

export default function ForgotPassword() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not send reset", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
  };

  return (
    <>
    <Seo
      title="Reset Your Password | Alto Whisky"
      description="Request a password reset link for your Alto Whisky client account."
      path="/portal/forgot-password"
    />
    <AuthShell
      eyebrow="Client Portal"
      title="Reset password"
      subtitle={sent ? undefined : "Enter your email and we'll send you a reset link."}
      footerSlot={
        <p className="font-body text-xs text-muted-foreground">
          <Link to="/portal/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      }
    >
      {sent ? (
        <p className="font-body text-sm text-muted-foreground text-center">
          If an account exists for that email, a reset link has been sent.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-3 hover:opacity-90 disabled:opacity-50">
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthShell>
    </>
  );
}
