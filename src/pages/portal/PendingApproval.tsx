import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function PendingApproval() {
  const { profile, signOut } = useAuth();
  const isSuspended = profile?.status === "suspended";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <Link to="/" className="block mb-8 display-heading text-3xl">Alto Whisky</Link>
        <div className="bg-card border border-border p-10">
          <h1 className="display-heading text-3xl mb-4">
            {isSuspended ? "Account suspended" : "Awaiting approval"}
          </h1>
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
            {isSuspended
              ? "Your account has been suspended. Please contact us if you believe this is in error."
              : "Thank you for registering. One of our Portfolio Advisors will review your account shortly. You'll receive an email once it's approved."}
          </p>
          <button onClick={signOut}
            className="font-body text-xs uppercase tracking-[0.25em] border border-border px-8 py-3 hover:bg-muted">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
