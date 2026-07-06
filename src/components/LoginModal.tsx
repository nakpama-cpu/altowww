import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";

type Props = { open: boolean; onClose: () => void };

export default function LoginModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }
    onClose();
    navigate("/portal");
  };

  const handleOAuth = async (provider: "google") => {
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: `${window.location.origin}/portal`,
    });
    if (result.error) {
      toast({
        title: "Google sign in failed",
        description: String(result.error),
        variant: "destructive",
      });
    }
  };

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card border border-border p-8 md:p-10 relative max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="display-heading text-2xl mb-2">Client Portal</h2>
        <p className="font-body text-sm text-muted-foreground mb-8">Sign in to view your portfolio.</p>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuth("google")}
            type="button"
            className="w-full font-body text-xs uppercase tracking-[0.25em] border border-border py-3 hover:bg-muted transition-colors"
          >
            Continue with Google
          </button>
        </div>

        <div className="relative my-6 text-center">
          <span className="bg-card px-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground relative z-10">or</span>
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex justify-between font-body text-xs">
          <Link to="/portal/forgot-password" onClick={onClose} className="text-muted-foreground hover:text-primary">
            Forgot password?
          </Link>
          <Link to="/portal/signup" onClick={onClose} className="text-muted-foreground hover:text-primary">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
