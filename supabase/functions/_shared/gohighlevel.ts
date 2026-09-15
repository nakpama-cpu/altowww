// Pushes contacts to GoHighLevel via the Inbound Webhook trigger of a GHL
// workflow. The workflow URL is stored as the GHL_INBOUND_WEBHOOK_URL secret
// and is never hardcoded. Fire-and-forget by design: failures are logged and
// returned, never thrown, so lead capture and signup flows are unaffected
// when GHL is unreachable or not yet configured.

export interface GHLContact {
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  message?: string | null;
  /** Raw source key, e.g. "brochure_request" | "contact_form" | "portal_signup" */
  source: string;
  tags?: string[];
  submittedAt?: string;
}

export async function pushToGHL(
  contact: GHLContact
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const url = Deno.env.get("GHL_INBOUND_WEBHOOK_URL");
  if (!url) {
    console.warn("pushToGHL: GHL_INBOUND_WEBHOOK_URL not configured — skipping", {
      source: contact.source,
    });
    return { ok: false, skipped: true };
  }

  try {
    const fullName = [contact.firstName, contact.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: contact.firstName ?? "",
        lastName: contact.lastName ?? "",
        fullName,
        email: contact.email.toLowerCase().trim(),
        phone: contact.phone ?? "",
        message: contact.message ?? "",
        source: contact.source,
        tags: contact.tags ?? [],
        submittedAt: contact.submittedAt ?? new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error("pushToGHL: GHL webhook responded with error", {
        status: res.status,
        source: contact.source,
      });
      return { ok: false, error: `status_${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("pushToGHL failed:", err, { source: contact.source });
    return { ok: false, error: String(err) };
  }
}
