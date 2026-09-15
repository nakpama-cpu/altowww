// Fires a Meta Pixel "RegisteredVisit" event for signed-in users, with
// advanced matching (SHA-256 hashed email) so registered users can be
// identified/segmented in Meta Events Manager.
const PIXEL_ID = "1680254689736687";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const trackedUsers = new Set<string>();

const sha256Hex = async (value: string) => {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const trackRegisteredVisit = async (
  email: string | null | undefined,
  userId: string
) => {
  if (!email || !userId || trackedUsers.has(userId)) return;
  if (typeof window.fbq !== "function") return;
  trackedUsers.add(userId);
  try {
    const em = await sha256Hex(email);
    // Re-init with advanced matching data for this known user.
    window.fbq("init", PIXEL_ID, { em, external_id: userId });
    window.fbq("track", "RegisteredVisit", {}, { external_id: userId });
  } catch {
    /* never block auth flow on pixel errors */
  }
};

// Standard Meta "Lead" event for enquiry/landing page form submissions.
export const trackLead = () => {
  if (typeof window.fbq !== "function") return;
  try {
    window.fbq("track", "Lead");
  } catch {
    /* never block form submission on pixel errors */
  }
};
