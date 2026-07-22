import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CartLine = { listing_id: string; quantity: number };

async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  opts: { email?: string; userId: string },
): Promise<string> {
  if (!/^[a-zA-Z0-9_-]+$/.test(opts.userId)) throw new Error("Invalid userId");
  const found = await stripe.customers.search({
    query: `metadata['userId']:'${opts.userId}'`,
    limit: 1,
  });
  if (found.data.length) return found.data[0].id;
  if (opts.email) {
    const existing = await stripe.customers.list({ email: opts.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (customer.metadata?.userId !== opts.userId) {
        await stripe.customers.update(customer.id, {
          metadata: { ...customer.metadata, userId: opts.userId },
        });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({
    ...(opts.email && { email: opts.email }),
    metadata: { userId: opts.userId },
  });
  return created.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) throw new Error("Unauthorized");

    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    );
    const { data: userData, error: userErr } = await supabaseUser.auth.getUser(token);
    if (userErr || !userData?.user) throw new Error("Unauthorized");
    const user = userData.user;

    const body = await req.json();
    const items: CartLine[] = Array.isArray(body?.items) ? body.items : [];
    const discountCodeRaw: string | null = body?.discount_code?.toString().trim().toUpperCase() || null;
    const environment: StripeEnv = body?.environment === "live" ? "live" : "sandbox";
    const returnUrl: string = body?.return_url;
    if (!returnUrl) throw new Error("Missing return_url");
    if (!items.length) throw new Error("Cart is empty");

    // Service client for trusted reads (bypass RLS on listings + profile)
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify KYC
    const { data: profile } = await admin
      .from("profiles")
      .select("email, address_verification_status, age_verification_status")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile) throw new Error("Profile not found");
    if (profile.address_verification_status !== "verified" || profile.age_verification_status !== "verified") {
      return new Response(
        JSON.stringify({ error: "Address and identity verification required before checkout." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Trusted listing data
    const listingIds = [...new Set(items.map((i) => i.listing_id))];
    const { data: listings, error: listErr } = await admin
      .from("cask_listings")
      .select("id, list_price, currency, spirit, status, stock_qty, reserved_qty, distilleries(name)")
      .in("id", listingIds);
    if (listErr || !listings) throw new Error("Could not load listings");

    const listingMap = new Map(listings.map((l: any) => [l.id, l]));
    for (const i of items) {
      const l: any = listingMap.get(i.listing_id);
      if (!l) throw new Error(`Listing unavailable: ${i.listing_id}`);
      if (l.status !== "active") throw new Error(`Listing sold out: ${l.spirit}`);
      const available = Math.max(0, (l.stock_qty ?? 0) - (l.reserved_qty ?? 0));
      if (i.quantity < 1 || i.quantity > available) throw new Error(`Insufficient stock for ${l.spirit}`);
    }

    // Pallet pricing: 7.5% off per line when qty >= 6 AND the listing has 6+ available.
    const PALLET_MIN_QTY = 6;
    const PALLET_PCT = 7.5;

    let subtotal = 0;
    for (const i of items) {
      const l: any = listingMap.get(i.listing_id);
      subtotal += Number(l.list_price) * i.quantity;
    }
    const currency = ((listings[0] as any)?.currency ?? "GBP").toString();

    // Validate discount code (do NOT redeem — redeem on payment success)
    let codePercent = 0;
    if (discountCodeRaw) {
      const { data: dc } = await admin
        .from("discount_codes")
        .select("id, percent, expires_at, active")
        .eq("code", discountCodeRaw)
        .maybeSingle();
      if (!dc) throw new Error("Invalid discount code");
      if (!dc.active) throw new Error("Discount code is inactive");
      if (dc.expires_at && new Date(dc.expires_at) < new Date()) throw new Error("Discount code has expired");

      const { data: assignment } = await admin
        .from("discount_code_clients")
        .select("id, redeemed_at")
        .eq("code_id", dc.id)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!assignment) throw new Error("Discount code not valid for this account");
      if (assignment.redeemed_at) throw new Error("Discount code has already been used");

      codePercent = Number(dc.percent);
    }

    // Compute effective percent per line: max(code, pallet). Never stacked.
    const linePcts = items.map((i) => {
      const l: any = listingMap.get(i.listing_id);
      const available = Math.max(0, (l.stock_qty ?? 0) - (l.reserved_qty ?? 0));
      const palletEligible = available >= PALLET_MIN_QTY && i.quantity >= PALLET_MIN_QTY;
      return Math.max(codePercent, palletEligible ? PALLET_PCT : 0);
    });

    let total = 0;
    items.forEach((i, idx) => {
      const l: any = listingMap.get(i.listing_id);
      const unit = Number(l.list_price) * (1 - linePcts[idx] / 100);
      total += Math.round(unit * 100) / 100 * i.quantity;
    });
    total = Math.round(total * 100) / 100;
    const discountAmount = Math.round((subtotal - total) * 100) / 100;

    const stripe = createStripeClient(environment);
    const customerId = await resolveOrCreateCustomer(stripe, { email: profile.email, userId: user.id });

    // Build Stripe line_items with dynamic pricing (max discount per line)
    const stripeLineItems = items.map((i, idx) => {
      const l: any = listingMap.get(i.listing_id);
      const unitAfter = Number(l.list_price) * (1 - linePcts[idx] / 100);
      const unitCents = Math.round(unitAfter * 100);
      const distilleryName = l.distilleries?.name ?? l.spirit;
      return {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: distilleryName,
            description: l.spirit,
          },
          unit_amount: unitCents,
        },
        quantity: i.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded_page" as any,
      return_url: returnUrl,
      customer: customerId,
      billing_address_collection: "required",
      line_items: stripeLineItems,
      payment_intent_data: {
        description: `Alto Whisky — ${items.length} cask${items.length > 1 ? "s" : ""}`,
      },
      metadata: {
        userId: user.id,
        discount_code: discountCodeRaw ?? "",
      },
    } as any);

    // Store checkout session snapshot
    await admin.from("checkout_sessions").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      environment,
      cart: items,
      discount_code: discountCodeRaw,
      subtotal,
      discount_amount: discountAmount,
      total,
      currency,
      status: "pending",
    });

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret, sessionId: session.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-checkout error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
