import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CountrySelect, PhoneField } from "@/components/auth/CountryFields";

type Props = { open: boolean; onClose: () => void };

export default function LoginModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupForm, setSignupForm] = useState({ firstName: "", lastName: "", email: "", phone: "", phoneCountryCode: "", country: "", password: "" });

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
    if (!open) setMode("signin");
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
    const phoneCheck = validateE164(signupForm.phoneCountryCode, signupForm.phone);
    if (!phoneCheck.valid) {
      toast({ title: "Invalid phone number", description: phoneCheck.error, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signupForm.email.trim(),
      password: signupForm.password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
        data: {
          first_name: signupForm.firstName.trim(),
          last_name: signupForm.lastName.trim(),
          phone: phoneCheck.e164,
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

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card border border-border p-6 md:p-7 relative max-h-[95vh] overflow-y-auto shadow-2xl"
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

        {mode === "signin" ? (
          <>
            <h2 className="display-heading text-2xl mb-2">Client Portal</h2>
            <p className="font-body text-sm text-muted-foreground mb-8">Sign in to view your portfolio.</p>

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
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-muted-foreground hover:text-primary"
              >
                Create account
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="display-heading text-2xl mb-1">Create Account</h2>
            <p className="font-body text-xs text-muted-foreground mb-4">
              Your account will be reviewed before portfolio access.
            </p>

            <form onSubmit={handleSignup} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5">First Name</label>
                  <input
                    required
                    maxLength={100}
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                    className="w-full bg-transparent border-b border-border py-1.5 font-body text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5">Last Name</label>
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
                <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5">Email</label>
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
                <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-1.5">Password</label>
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
                className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Creating…" : "Create Account"}
              </button>
            </form>

            <p className="mt-4 text-center font-body text-xs text-muted-foreground">
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
