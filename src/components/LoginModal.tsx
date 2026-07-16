import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CountrySelect, PhoneField } from "@/components/auth/CountryFields";
import { TitleSelect } from "@/components/auth/TitleSelect";
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
  const [signupForm, setSignupForm] = useState({ title: "", firstName: "", lastName: "", email: "", phone: "", phoneCountryCode: "", country: "", password: "" });
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
    const email = signupForm.email.trim();
    const { error } = await supabase.auth.signUp({
      email,
      password: signupForm.password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
        data: {
          title: signupForm.title,
          first_name: signupForm.firstName.trim(),
          last_name: signupForm.lastName.trim(),
          phone: signupForm.phone.trim(),
          phone_country_code: signupForm.phoneCountryCode,
          country: signupForm.country,
        },
      },
    });
    setLoading(false);
    if (!error) {
      supabase.functions.invoke("notify-new-signup", { body: { email } }).catch(() => {});
    }
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

  const renderHeader = (eyebrow: string, title: string, subtitle?: string) => (
    <>
      <p className="font-body text-[10px] uppercase tracking-[0.3em] text-primary mb-2 text-center">
        {eyebrow}
      </p>
      <h2 className="display-heading text-xl sm:text-2xl text-center mb-1">{title}</h2>
      <div className="mx-auto mb-3 h-px w-16 bg-primary" aria-hidden="true" />
      {subtitle && (
        <p className="font-body text-xs text-muted-foreground text-center mb-4 leading-snug">
          {subtitle}
        </p>
      )}
    </>
  );

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-2 py-2 sm:px-4 sm:py-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card border border-border shadow-2xl p-4 sm:p-6 pb-6 sm:pb-8 text-foreground relative max-h-[calc(100vh-0.5rem)] sm:max-h-[calc(100vh-2rem)] overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full bg-black/60 text-white backdrop-blur-sm p-1.5 transition-colors hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {mode === "signin" && (
          <>
            {renderHeader("Client Portal", "Sign in", "Access your portfolio and available stock.")}

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

            <div className="mt-4 text-center">
              <div className="flex flex-col items-center gap-2 font-body text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={() => { setResetEmail(email); setResetSent(false); setMode("forgot"); }}
                  className="hover:text-primary"
                >
                  Forgot password?
                </button>
                <p>
                  New to Alto?{" "}
                  <button type="button" onClick={() => setMode("signup")} className="text-primary hover:underline">
                    Create an account
                  </button>
                </p>
              </div>
            </div>
          </>
        )}

        {mode === "forgot" && (
          <>
            {renderHeader(
              "Client Portal",
              "Reset password",
              resetSent
                ? "If an account exists for that email, a reset link has been sent."
                : "Enter your email and we'll send you a reset link."
            )}

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

            <div className="mt-4 text-center font-body text-xs text-muted-foreground">
              <button type="button" onClick={() => setMode("signin")} className="hover:text-primary">
                Back to sign in
              </button>
            </div>
          </>
        )}

        {mode === "signup" && (
          <>
            {renderHeader("Client Portal", "Create account", "Your account will be reviewed before portfolio access.")}

            <form onSubmit={handleSignup} className="space-y-2">
              <div className="grid grid-cols-[4.5rem_1fr_1fr] gap-3">
                <TitleSelect
                  value={signupForm.title}
                  onChange={(title) => setSignupForm({ ...signupForm, title })}
                  compact
                />
                <div>
                  <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">First Name</label>
                  <input
                    required
                    maxLength={100}
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Last Name</label>
                  <input
                    required
                    maxLength={100}
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Email</label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
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
                <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-1"
              >
                {loading ? "Creating…" : "Create Account"}
              </button>
            </form>

            <div className="mt-4 text-center font-body text-xs text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={() => setMode("signin")} className="text-primary hover:underline">
                Sign in
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
