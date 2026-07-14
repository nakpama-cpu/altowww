import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CountrySelect, PhoneField } from "@/components/auth/CountryFields";
import { useDetectedCountry } from "@/hooks/useDetectedCountry";

type Props = { open: boolean; onClose: () => void };
type Mode = "signin" | "signup" | "forgot";

export default function LoginModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [signupForm, setSignupForm] = useState({ firstName: "", lastName: "", email: "", phone: "", phoneCountryCode: "", country: "", password: "" });
  const detected = useDetectedCountry();

  useEffect(() => {
    if (!detected) return;
    setSignupForm((f) => {
      if (f.country || f.phoneCountryCode) return f;
      return { ...f, country: detected.code, phoneCountryCode: detected.dialingCode };
    });
  }, [detected]);

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

  useEffect(() => {
    if (!open) {
      setMode("signin");
      setResetSent(false);
    }
  }, [open]);

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signupForm.email.trim(),
      password: signupForm.password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
        data: {
          first_name: signupForm.firstName.trim(),
          last_name: signupForm.lastName.trim(),
          phone: signupForm.phone.trim(),
          phone_country_code: signupForm.phoneCountryCode,
          country: signupForm.country,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account created", description: "Check your email to confirm, then sign in." });
    setMode("signin");
    setEmail(signupForm.email.trim());
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/portal/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Could not send reset", description: error.message, variant: "destructive" });
      return;
    }
    setResetSent(true);
  };

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-3 py-3 sm:px-4 sm:py-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card border border-border p-4 sm:p-6 relative max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-3rem)] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {mode === "signin" && (
          <>
            <h2 className="display-heading text-2xl mb-1">Client Portal</h2>
            <p className="font-body text-sm text-muted-foreground mb-6">Sign in to view your portfolio.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="mt-5 flex justify-between font-body text-xs">
              <button
                type="button"
                onClick={() => { setResetEmail(email); setResetSent(false); setMode("forgot"); }}
                className="text-muted-foreground hover:text-primary"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-muted-foreground hover:text-primary"
              >
                Create account
              </button>
            </div>
          </>
        )}

        {mode === "forgot" && (
          <>
            <h2 className="display-heading text-2xl mb-1">Reset Password</h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              {resetSent
                ? "If an account exists for that email, a reset link has been sent."
                : "Enter your email and we'll send you a reset link."}
            </p>

            {!resetSent && (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            )}

            <p className="mt-5 text-center font-body text-xs">
              <button type="button" onClick={() => setMode("signin")} className="text-muted-foreground hover:text-primary">
                Back to sign in
              </button>
            </p>
          </>
        )}

        {mode === "signup" && (
          <>
            <h2 className="display-heading text-xl mb-1">Create Account</h2>
            <p className="font-body text-[11px] text-muted-foreground mb-3">
              Your account will be reviewed before portfolio access.
            </p>

            <form onSubmit={handleSignup} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">First Name</label>
                  <input
                    required
                    maxLength={100}
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-1.5 font-body text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Last Name</label>
                  <input
                    required
                    maxLength={100}
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-1.5 font-body text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-1.5 font-body text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <CountrySelect
                value={signupForm.country}
                onChange={(code, dialingCode) =>
                  setSignupForm((f) => ({ ...f, country: code, phoneCountryCode: dialingCode }))
                }
              />
              <PhoneField
                countryCode={signupForm.phoneCountryCode}
                onCountryCodeChange={(phoneCountryCode) => setSignupForm({ ...signupForm, phoneCountryCode })}
                phone={signupForm.phone}
                onPhoneChange={(phone) => setSignupForm({ ...signupForm, phone })}
              />
              <div>
                <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-1.5 font-body text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
              >
                {loading ? "Creating…" : "Create Account"}
              </button>
            </form>

            <p className="mt-3 text-center font-body text-[11px] text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("signin")} className="text-primary">
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
