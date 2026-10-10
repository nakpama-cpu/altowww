import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { clearPortalVisit } from "@/lib/portalSession";

export type VerificationStatus = "not_submitted" | "pending" | "verified" | "rejected";
export type ProofOfAddressType = "utility_bill" | "bank_statement" | "driving_licence" | "council_tax" | "other";
export type ProofOfAgeType = "passport" | "driving_licence" | "national_id";

type Profile = {
  id: string;
  title: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string | null;
  phone_country_code: string | null;
  status: "pending" | "approved" | "suspended";
  client_discount_pct: number;
  date_of_birth: string | null;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_region: string | null;
  address_postcode: string | null;
  address_country: string | null;
  proof_of_address_path: string | null;
  proof_of_address_type: ProofOfAddressType | null;
  proof_of_address_issued_on: string | null;
  proof_of_age_path: string | null;
  proof_of_age_type: ProofOfAgeType | null;
  address_verified_at: string | null;
  age_verified_at: string | null;
  address_verification_status: VerificationStatus;
  age_verification_status: VerificationStatus;
  verification_notes: string | null;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  profile: null,
  isAdmin: false,
  loading: true,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfileAndRole = async (uid: string) => {
    const [{ data: prof }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    setProfile(prof as Profile | null);
    setIsAdmin(!!roles?.some((r) => r.role === "admin"));
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => loadProfileAndRole(sess.user.id), 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        loadProfileAndRole(data.session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) await loadProfileAndRole(user.id);
  };

  const signOut = async () => {
    clearPortalVisit();
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, isAdmin, loading, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
