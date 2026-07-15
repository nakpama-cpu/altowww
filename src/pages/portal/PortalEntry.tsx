import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import AuthShell from "@/components/auth/AuthShell";
import PortalLayout from "./PortalLayout";


type ConfirmationState =
  | { status: "none" }
  | { status: "confirmed" }
  | { status: "error"; message: string };

const getConfirmationState = (): ConfirmationState => {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);
  const type = hashParams.get("type") || searchParams.get("type");
  const errorMessage =
    hashParams.get("error_description") ||
    searchParams.get("error_description") ||
    hashParams.get("error") ||
    searchParams.get("error");

  if (errorMessage) {
    return {
      status: "error",
      message: errorMessage.replace(/\+/g, " "),
    };
  }

  const isSignupReturn = type === "signup" || type === "email_change" || type === "invite";
  const hasAuthReturn = hashParams.has("access_token") || searchParams.has("code") || searchParams.has("token_hash");

  return isSignupReturn || hasAuthReturn ? { status: "confirmed" } : { status: "none" };
};

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
  const [confirmationState] = useState<ConfirmationState>(() => getConfirmationState());
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmationState.status === "none") return;

    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).catch(() => {});
    }

    const cleanUrl = window.location.pathname;
    window.setTimeout(() => {
      try {
        history.replaceState(null, "", cleanUrl);
      } catch { /* ignore */ }
    }, 750);
  }, [confirmationState.status]);

  if (confirmationState.status !== "none") {
    const isError = confirmationState.status === "error";
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <Link to="/" className="block mb-8 display-heading text-3xl">Alto Whisky</Link>
          <div className="bg-card border border-border p-10">
            <h1 className="display-heading text-3xl mb-4">
              {isError ? "Email link expired" : "Email confirmed"}
            </h1>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
              {isError
                ? "This confirmation link has already been used or has expired. If your email has already been confirmed, you can continue to sign in."
                : "Thank you for confirming your email. One of our Portfolio Advisors will review your account shortly. You'll receive an email as soon as it's approved."}
            </p>
            <button
              onClick={() => navigate(isError ? "/portal/login" : "/portal")}
              className="font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground px-8 py-3 hover:opacity-90 transition-opacity"
            >
              {isError ? "Sign in" : "Continue"}
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
