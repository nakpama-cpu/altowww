import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthShell from "@/components/auth/AuthShell";

export default function PendingApproval() {
  const { user, profile, loading, isAdmin, signOut } = useAuth();

  const isSuspended = profile?.status === "suspended";
  const shouldSignOut = !!user && !isAdmin && profile && profile.status !== "approved";

  // Ensure unapproved users are never left signed in.
  useEffect(() => {
    if (shouldSignOut) {
      signOut();
    }
  }, [shouldSignOut, signOut]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (isAdmin || profile?.status === "approved") return <Navigate to="/portal" replace />;

  return (
    <AuthShell
      eyebrow="Client Portal"
      title={isSuspended ? "Account suspended" : "Awaiting approval"}
      subtitle={
        isSuspended
          ? "Your account has been suspended. Please contact us if you believe this is in error."
          : "Thank you for registering. One of our Portfolio Advisors will review your account shortly. You'll receive an email as soon as it's approved."
      }
    >
      <Link
        to="/"
        className="block w-full text-center font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2 hover:opacity-90 transition-opacity mt-1"
      >
        Back to Homepage
      </Link>
    </AuthShell>
  );
}
