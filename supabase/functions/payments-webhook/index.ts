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

  const rawCart: any = cs.cart;
  const invoiceId: string | null = !Array.isArray(rawCart) && rawCart?.invoice_id ? String(rawCart.invoice_id) : null;

  // Paying an existing pending invoice: mark it paid (holdings are materialised
  // by the invoice trigger) and skip creating a duplicate invoice/order set.
  if (invoiceId) {
    const { error: payErr } = await sb.rpc("mark_invoice_paid", { _invoice_id: invoiceId });
    if (payErr) console.error("mark_invoice_paid failed", payErr);
    await sb
      .from("invoices")
      .update({ payment_method: "card", stripe_session_id: sessionId })
      .eq("id", invoiceId);
    await sb.from("checkout_sessions").update({ status: "completed" }).eq("stripe_session_id", sessionId);
    return;
  }

  const cart = (rawCart as Array<{ listing_id: string; quantity: number }>) || [];

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

  // Create a paid invoice record so card purchases appear alongside bank transfers
  try {
    const { data: existing } = await sb
      .from("invoices")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (!existing) {
      const { data: profile } = await sb
        .from("profiles")
        .select("email, title, first_name, last_name, address_line1, address_line2, address_city, address_region, address_postcode, address_country")
        .eq("id", cs.user_id)
        .maybeSingle();

      const listingIds = [...new Set(cart.map((i) => i.listing_id))];
      const { data: listings } = await sb
        .from("cask_listings")
        .select("id, list_price, spirit, spirit_name, cask_type, cask_size_litres, wood, abv, fill_date, distilleries(name)")
        .in("id", listingIds);
      const listingMap = new Map((listings ?? []).map((l: any) => [l.id, l]));

      const totalUnits = cart.reduce((s, i) => s + i.quantity, 0);
      const subtotal = cart.reduce((s, i) => {
        const l: any = listingMap.get(i.listing_id);
        return s + Number(l?.list_price ?? 0) * i.quantity;
      }, 0);
      const total = Number(cs.total);
      const discountAmount = Math.max(0, Math.round((subtotal - total) * 100) / 100);

      const { data: numberData } = await sb.rpc("next_invoice_number");
      const invoiceNumber = (numberData as string) ?? `AW-CARD-${sessionId.slice(-8)}`;
      const paymentReference = invoiceNumber;
      const nowIso = new Date().toISOString();

      const { data: invoice } = await sb
        .from("invoices")
        .insert({
          user_id: cs.user_id,
          invoice_number: invoiceNumber,
          payment_reference: paymentReference,
          currency: cs.currency,
          subtotal: Math.round(subtotal * 100) / 100,
          discount_amount: discountAmount,
          total,
          discount_code: cs.discount_code ?? null,
          payment_method: "card",
          status: "paid",
          paid_at: nowIso,
          client_confirmed_at: nowIso,
          due_at: nowIso,
          stripe_session_id: sessionId,
          bill_to: {
            name: [profile?.title, profile?.first_name, profile?.last_name].filter(Boolean).join(" "),
            email: profile?.email,
            lines: [
              profile?.address_line1,
              profile?.address_line2,
              profile?.address_city,
              profile?.address_region,
              profile?.address_postcode,
              profile?.address_country,
            ].filter(Boolean),
          },
        })
        .select("id")
        .single();

      if (invoice) {
        const unitPaid = totalUnits > 0 ? Math.round((total / totalUnits) * 100) / 100 : 0;
        await sb.from("invoice_items").insert(
          cart.map((i) => {
            const l: any = listingMap.get(i.listing_id);
            return {
              invoice_id: invoice.id,
              listing_id: i.listing_id,
              distillery: l?.distilleries?.name ?? null,
              spirit: l?.spirit ?? null,
              spirit_name: l?.spirit_name ?? null,
              cask_type: [l?.cask_type, l?.cask_size_litres ? `${Number(l.cask_size_litres)}L` : null].filter(Boolean).join(" ") || null,
              wood: l?.wood ?? null,
              abv: l?.abv ?? null,
              vintage_year: l?.fill_date ? new Date(l.fill_date).getFullYear() : null,
              quantity: i.quantity,
              list_price: Number(l?.list_price ?? 0),
              unit_price: unitPaid,
              line_total: Math.round(unitPaid * i.quantity * 100) / 100,
            };
          }),
        );
      }
    }
  } catch (e) {
    console.error("card invoice creation failed", e);
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
