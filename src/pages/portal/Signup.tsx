import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CountrySelect, PhoneField } from "@/components/auth/CountryFields";
import { useDetectedCountry } from "@/hooks/useDetectedCountry";
import AuthShell from "@/components/auth/AuthShell";
import Seo from "@/components/Seo";
import { TitleSelect } from "@/components/auth/TitleSelect";


export default function PortalSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", firstName: "", lastName: "", email: "", phone: "", phoneCountryCode: "", country: "", password: "" });
  const [loading, setLoading] = useState(false);
  const detected = useDetectedCountry();

  useEffect(() => {
    if (!detected) return;
    setForm((f) => {
      if (f.country || f.phoneCountryCode) return f;
      return { ...f, country: detected.code, phoneCountryCode: detected.dialingCode };
    });
  }, [detected]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = form.email.trim();
    const { error } = await supabase.auth.signUp({
      email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
        data: {
          title: form.title,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: form.phone.trim(),
          phone_country_code: form.phoneCountryCode,
          country: form.country,
        },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }
    // Fire-and-forget admin notification (also enqueued when profile trigger fires).
    supabase.functions.invoke("notify-new-signup", { body: { email } }).catch(() => {});
    toast({ title: "Account created", description: "Check your email to confirm, then sign in." });
    navigate("/portal/login");
  };

  return (
    <>
    <Seo
      title="Create a Client Account | Alto Whisky"
      description="Open an Alto Whisky client account to access cask investment opportunities and portfolio tools."
      path="/portal/signup"
    />
    <AuthShell
      eyebrow="Client Portal"
      title="Create your account"
      subtitle="Your account will be reviewed by our team before you can access portfolio features."
    >
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-[5rem_1fr_1fr] gap-3">
          <TitleSelect value={form.title} onChange={(title) => setForm({ ...form, title })} compact />
          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">First Name</label>
            <input required maxLength={100} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Last Name</label>
            <input required maxLength={100} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary" />
        </div>
        <CountrySelect
          value={form.country}
          onChange={(code, dialingCode) =>
            setForm((f) => ({ ...f, country: code, phoneCountryCode: dialingCode }))
          }
        />
        <PhoneField
          countryCode={form.phoneCountryCode}
          onCountryCodeChange={(phoneCountryCode) => setForm({ ...form, phoneCountryCode })}
          phone={form.phone}
          onPhoneChange={(phone) => setForm({ ...form, phone })}
        />
        <div>
          <label className="block font-body text-[10px] uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Password</label>
          <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-transparent border-b border-border py-1 font-body text-sm focus:outline-none focus:border-primary" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-1">
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>

      <p className="mt-2 text-center font-body text-[11px] text-muted-foreground">
        Already have an account? <Link to="/portal/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </AuthShell>
    </>
  );
}
