import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

async function fulfilCheckoutSession(session: any, env: StripeEnv) {
  const sb = getSupabase();
  const sessionId: string = session.id;
  const paymentIntent: string | null =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  // Load pending checkout session (idempotent — skip if already fulfilled)
  const { data: cs, error: csErr } = await sb
    .from("checkout_sessions")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (csErr) {
    console.error("Failed to load checkout_session", csErr);
    return;
  }
  if (!cs) {
    console.warn("No checkout_session row for", sessionId);
    return;
  }
  if (cs.status === "completed") {
    console.log("Already fulfilled", sessionId);
    return;
  }

  const cart = (cs.cart as Array<{ listing_id: string; quantity: number }>) || [];
  const perUnitPaid =
    cart.reduce((s, i) => s + i.quantity, 0) > 0
      ? Number(cs.total) / cart.reduce((s, i) => s + i.quantity, 0)
      : 0;

  // Insert one order row per unit — matches existing schema
  const rows: any[] = [];
  for (const line of cart) {
    for (let n = 0; n < line.quantity; n++) {
      rows.push({
        buyer_id: cs.user_id,
        listing_id: line.listing_id,
        amount: Number(perUnitPaid.toFixed(2)),
        currency: cs.currency,
        status: "paid",
        discount_code: null, // avoid re-triggering discount validation on insert
        stripe_session_id: sessionId,
        stripe_payment_intent: paymentIntent,
      });
    }
  }

  if (rows.length) {
    const { error: insErr } = await sb.from("orders").insert(rows);
    if (insErr) {
      console.error("Failed to insert orders", insErr);
      throw insErr;
    }
    // Overwrite the amount enforced by the DB trigger with what the customer actually paid
    await sb
      .from("orders")
      .update({ amount: Number(perUnitPaid.toFixed(2)) })
      .eq("stripe_session_id", sessionId);
  }

  // Redeem discount code (one-use per client)
  if (cs.discount_code) {
    const { data: dc } = await sb
      .from("discount_codes")
      .select("id")
      .eq("code", cs.discount_code)
      .maybeSingle();
    if (dc) {
      await sb
        .from("discount_code_clients")
        .update({ redeemed_at: new Date().toISOString() })
        .eq("code_id", dc.id)
        .eq("user_id", cs.user_id)
        .is("redeemed_at", null);
    }
  }

  await sb
    .from("checkout_sessions")
    .update({ status: "completed" })
    .eq("stripe_session_id", sessionId);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await fulfilCheckoutSession(event.data.object, env);
        break;
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const s: any = event.data.object;
        await getSupabase()
          .from("checkout_sessions")
          .update({ status: "failed" })
          .eq("stripe_session_id", s.id);
        break;
      }
      default:
        console.log("Unhandled event:", event.type);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
