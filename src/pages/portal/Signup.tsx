import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CountrySelect, PhoneField } from "@/components/auth/CountryFields";
import { validateE164 } from "@/lib/phone";

export default function PortalSignup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", phoneCountryCode: "", country: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneCheck = validateE164(form.phoneCountryCode, form.phone);
    if (phoneCheck.valid === false) {
      toast({ title: "Invalid phone number", description: phoneCheck.error, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal`,
        data: {
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: phoneCheck.e164,
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
    toast({ title: "Account created", description: "Check your email to confirm, then sign in." });
    navigate("/portal/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8 display-heading text-3xl">Alto Whisky</Link>
        <div className="bg-card border border-border p-8 md:p-10">
          <h1 className="display-heading text-2xl mb-2">Create Account</h1>
          <p className="font-body text-sm text-muted-foreground mb-8">
            Your account will be reviewed by our team before you can access portfolio features.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">First Name</label>
                <input required maxLength={100} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Last Name</label>
                <input required maxLength={100} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
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
              <label className="block font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">Password</label>
              <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent border-b border-border py-2 font-body text-sm focus:outline-none focus:border-primary" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-3 hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? "Creating…" : "Create Account"}
            </button>
          </form>
          <p className="mt-6 text-center font-body text-xs text-muted-foreground">
            Already have an account? <Link to="/portal/login" className="text-primary">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
