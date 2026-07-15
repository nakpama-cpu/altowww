import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthShell from "@/components/auth/AuthShell";

export default function PendingApproval() {
  const { user, profile, loading, isAdmin, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-body text-xs uppercase tracking-[0.25em] text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/portal/login" replace />;
  if (isAdmin || profile?.status === "approved") return <Navigate to="/portal" replace />;

  const isSuspended = profile?.status === "suspended";

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
      <button
        onClick={signOut}
        className="w-full font-body text-xs uppercase tracking-[0.25em] bg-primary text-primary-foreground py-2 hover:opacity-90 transition-opacity mt-1"
      >
        Sign out
      </button>
    </AuthShell>
  );
}
