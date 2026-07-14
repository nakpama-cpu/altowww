import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthShell from "@/components/auth/AuthShell";
import Seo from "@/components/Seo";

export default function ResetPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Could not update password", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Password updated" });
    navigate("/portal");
  };

  return (
    <>
    <Seo
      title="Set a New Password | Alto Whisky"
      description="Set a new password for your Alto Whisky client account."
      path="/portal/reset-password"
    />
    <AuthShell
      eyebrow="Client Portal"
      title="Set new password"
      subtitle="Choose a strong password of at least 8 characters."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">New Password</label>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-3 hover:opacity-90 disabled:opacity-50">
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </AuthShell>
    </>
  );
}
