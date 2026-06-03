import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8 display-heading text-3xl">Alto Whisky</Link>
        <div className="bg-card border border-border p-8 md:p-10">
          <h1 className="display-heading text-2xl mb-2">Set New Password</h1>
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
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
        </div>
      </div>
    </div>
  );
}
