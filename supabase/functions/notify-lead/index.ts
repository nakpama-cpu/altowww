import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const ALTO_EMAIL = Deno.env.get("ALTO_NOTIFY_EMAIL") ?? "nick@altowhisky.com";
const FROM_EMAIL = Deno.env.get("ALTO_FROM_EMAIL") ?? "noreply@altowhisky.com";
const WEBHOOK_SECRET = Deno.env.get("LEAD_WEBHOOK_SECRET") ?? "";
const FROM_NAME = "Alto Asset Management";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string | null;
  source: string | null;
  created_at: string;
}

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Lead;
  old_record: Lead | null;
}

// Escape untrusted lead-provided text before it goes into an HTML template.
function esc(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Only safe to interpolate into href="mailto:" / "tel:" attributes.
function escAttr(v: unknown): string {
  return encodeURIComponent(String(v ?? ""));
}

async function sendEmail(to: string, toName: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [{ email: to, name: toName }],
      subject,
      html,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Resend error: ${JSON.stringify(data)}`);
  return data;
}

function sourceLabel(source: string | null): string {
  switch (source) {
    case "brochure_request": return "Brochure Request";
    case "advisor_callback": return "Advisor Callback";
    case "contact_form": return "Contact Form";
    default: return source ?? "Website";
  }
}

function prospectEmail(lead: Lead): string {
  const isBrochure = lead.source === "brochure_request";
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Alto Asset Management</title>
<style>
  body { margin: 0; padding: 0; background: #f9f6f1; font-family: Georgia, 'Times New Roman', serif; }
  .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e8e0d4; }
  .header { background: #1a1a1a; padding: 32px 40px; text-align: center; }
  .header h1 { color: #c9a96e; margin: 0; font-size: 22px; font-weight: normal; letter-spacing: 0.2em; text-transform: uppercase; }
  .header p { color: #888; margin: 6px 0 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; font-family: 'Helvetica Neue', sans-serif; }
  .body { padding: 40px 40px 32px; }
  .body h2 { color: #1a1a1a; font-size: 20px; font-weight: normal; margin: 0 0 16px; }
  .body p { color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 16px; font-family: 'Helvetica Neue', Helvetica, sans-serif; }
  .divider { border: none; border-top: 1px solid #e8e0d4; margin: 28px 0; }
  .stat-box { background: #f9f6f1; border-left: 3px solid #c9a96e; padding: 16px 20px; margin: 24px 0; }
  .stat-box p { margin: 0; font-size: 14px; color: #555; font-family: 'Helvetica Neue', sans-serif; }
  .stat-box strong { color: #1a1a1a; font-size: 17px; display: block; margin-bottom: 4px; font-family: Georgia, serif; }
  .cta { text-align: center; margin: 28px 0; }
  .cta a { background: #1a1a1a; color: #c9a96e; padding: 14px 32px; text-decoration: none; font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; display: inline-block; }
  .footer { background: #f2ede6; padding: 24px 40px; text-align: center; }
  .footer p { color: #888; font-size: 11px; font-family: 'Helvetica Neue', sans-serif; margin: 0; line-height: 1.6; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Alto Asset Management</h1>
    <p>Whisky Cask Investment</p>
  </div>
  <div class="body">
    <h2>Thank you, ${esc(lead.first_name)}.</h2>
    <p>
      ${isBrochure
        ? "We've received your brochure request and a member of our team will be in touch shortly with your copy — along with some useful information about building a whisky cask portfolio."
        : "We've received your enquiry and one of our Portfolio Advisors will be in touch shortly to discuss your requirements."}
    </p>
    <p>In the meantime, here are a few things worth knowing about whisky cask investment:</p>
    <div class="stat-box">
      <strong>582% appreciation</strong>
      <p>Rare whisky was the top-performing luxury asset of the past decade, according to the Knight Frank Luxury Investment Index.</p>
    </div>
    <div class="stat-box">
      <strong>CGT-free</strong>
      <p>Whisky casks are classified as wasting assets by HMRC — meaning any gains are typically free from Capital Gains Tax.</p>
    </div>
    <div class="stat-box">
      <strong>Tangible and secure</strong>
      <p>Your cask is stored in HMRC government-bonded warehouses in Scotland — fully insured and independently verifiable.</p>
    </div>
    <hr class="divider" />
    <p>If you have any immediate questions, don't hesitate to reach out directly.</p>
    <div class="cta">
      <a href="https://altowhisky.com/contact">Contact Our Team</a>
    </div>
  </div>
  <div class="footer">
    <p>Alto Asset Management &bull; altowhisky.com<br />
    This email was sent because you submitted an enquiry on our website.<br />
    If this wasn't you, please disregard this message.</p>
  </div>
</div>
</body>
</html>`;
}

function internalAlertEmail(lead: Lead): string {
  const sourceStr = sourceLabel(lead.source);
  const submittedAt = new Date(lead.created_at).toLocaleString("en-GB", {
    timeZone: "Europe/London",
    dateStyle: "full",
    timeStyle: "short",
  });
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>New Lead — Alto</title>
<style>
  body { margin: 0; padding: 0; background: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, sans-serif; }
  .wrapper { max-width: 560px; margin: 32px auto; background: #fff; border: 1px solid #ddd; border-radius: 4px; }
  .header { background: #1a1a1a; padding: 20px 32px; }
  .header h1 { color: #c9a96e; margin: 0; font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase; }
  .header p { color: #888; margin: 4px 0 0; font-size: 12px; }
  .body { padding: 28px 32px; }
  .badge { display: inline-block; background: #c9a96e; color: #fff; font-size: 11px; padding: 3px 10px; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 2px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; vertical-align: top; }
  td:first-child { color: #888; width: 110px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; padding-right: 16px; }
  td:last-child { color: #1a1a1a; font-weight: 500; }
  .message-row td:last-child { font-weight: normal; color: #444; white-space: pre-wrap; }
  .footer { background: #f9f9f9; padding: 16px 32px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>🔔 New Lead</h1>
    <p>Alto Asset Management</p>
  </div>
  <div class="body">
    <div class="badge">${esc(sourceStr)}</div>
    <table>
      <tr><td>Name</td><td>${esc(lead.first_name)} ${esc(lead.last_name)}</td></tr>
      <tr><td>Email</td><td><a href="mailto:${escAttr(lead.email)}" style="color:#1a1a1a">${esc(lead.email)}</a></td></tr>
      <tr><td>Phone</td><td><a href="tel:${escAttr(lead.phone)}" style="color:#1a1a1a">${esc(lead.phone)}</a></td></tr>
      <tr><td>Source</td><td>${esc(sourceStr)}</td></tr>
      ${lead.message ? `<tr class="message-row"><td>Message</td><td>${esc(lead.message)}</td></tr>` : ""}
      <tr><td>Submitted</td><td>${esc(submittedAt)}</td></tr>
    </table>
  </div>
  <div class="footer">Nix · Alto AI System · Lead ID: ${esc(lead.id)}</div>
</div>
</body>
</html>`;
}

// Constant-time-ish string compare
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    // Verify shared webhook secret. Configure the Supabase DB webhook to send
    // header `x-webhook-secret: <LEAD_WEBHOOK_SECRET>`.
    if (!WEBHOOK_SECRET) {
      console.error("LEAD_WEBHOOK_SECRET is not configured");
      return new Response(JSON.stringify({ ok: false, error: "server_misconfigured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    const provided = req.headers.get("x-webhook-secret") ?? "";
    if (!safeEqual(provided, WEBHOOK_SECRET)) {
      return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload: WebhookPayload = await req.json();

    // Only process new leads
    if (payload.type !== "INSERT" || payload.table !== "leads") {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const lead = payload.record;

    // Send both emails in parallel
    const [prospectResult, internalResult] = await Promise.allSettled([
      sendEmail(
        lead.email,
        `${lead.first_name} ${lead.last_name}`,
        "Thank you for your enquiry — Alto Asset Management",
        prospectEmail(lead)
      ),
      sendEmail(
        ALTO_EMAIL,
        "Nick",
        `🔔 New Lead: ${lead.first_name} ${lead.last_name} (${sourceLabel(lead.source)})`,
        internalAlertEmail(lead)
      ),
    ]);

    const errors: string[] = [];
    if (prospectResult.status === "rejected") errors.push(`prospect: ${prospectResult.reason}`);
    if (internalResult.status === "rejected") errors.push(`internal: ${internalResult.reason}`);

    if (errors.length === 2) {
      // Both failed — return 500 so Supabase can retry
      console.error("Both emails failed:", errors);
      return new Response(JSON.stringify({ ok: false, errors }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Lead notified:", lead.id, errors.length ? `(partial errors: ${errors.join(", ")})` : "✓");
    return new Response(JSON.stringify({ ok: true, errors: errors.length ? errors : undefined }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("notify-lead error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
