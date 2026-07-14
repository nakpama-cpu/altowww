import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthShell from "@/components/auth/AuthShell";

export default function PortalLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/portal");
  };

  return (
    <AuthShell
      eyebrow="Client Portal"
      title="Sign in"
      subtitle="Access your portfolio and available stock."
      footerSlot={
        <p className="font-body text-xs text-muted-foreground">
          New to Alto? <Link to="/portal/signup" className="text-primary hover:underline">Create an account</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-3 hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="mt-6 flex justify-center font-body text-xs">
        <Link to="/portal/forgot-password" className="text-muted-foreground hover:text-primary">Forgot password?</Link>
      </div>
    </AuthShell>
  );
}
