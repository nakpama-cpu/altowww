import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PortalLayout from "./PortalLayout";

/**
 * Entry component for /portal. When a user arrives via an email confirmation
 * link, Supabase redirects here with a hash like
 *   #access_token=...&type=signup
 * We detect that and show a friendly "Email confirmed" screen instead of
 * silently dropping them into the (protected) portal — which for a brand
 * new pending account would otherwise appear blank while the auth state
 * hydrates and then bounces to /portal/pending.
 */
export default function PortalEntry() {
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash || "";
    if (/type=(signup|email_change|recovery|invite|magiclink)/.test(hash) && /access_token=/.test(hash)) {
      setConfirmed(true);
      // Clean the hash so a refresh doesn't re-show the confirmation screen.
      try {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      } catch { /* ignore */ }
    }
  }, []);

  if (confirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <Link to="/" className="block mb-8 display-heading text-3xl">Alto Whisky</Link>
          <div className="bg-card border border-border p-10">
            <h1 className="display-heading text-3xl mb-4">Email confirmed</h1>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
              Thank you for confirming your email. One of our Portfolio Advisors
              will review your account shortly. You'll receive an email as soon
              as it's approved.
            </p>
            <button
              onClick={() => navigate("/portal")}
              className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <PortalLayout />
    </ProtectedRoute>
  );
}
