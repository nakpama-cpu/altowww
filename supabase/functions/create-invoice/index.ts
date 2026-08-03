import { createClient } from "npm:@supabase/supabase-js@2";
import { PAYMENT_TERMS_DAYS, SITE_URL } from "../_shared/invoice-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type CartLine = { listing_id: string; quantity: number };

const PALLET_MIN_QTY = 6;
const PALLET_PCT = 7.5;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
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
    if (!items.length) throw new Error("Cart is empty");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: profile } = await admin
      .from("profiles")
      .select("email, title, first_name, last_name, address_line1, address_line2, address_city, address_region, address_postcode, address_country, address_verification_status, age_verification_status")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile) throw new Error("Profile not found");
    if (profile.address_verification_status !== "verified" || profile.age_verification_status !== "verified") {
      return new Response(
        JSON.stringify({ error: "Address and identity verification required before checkout." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const listingIds = [...new Set(items.map((i) => i.listing_id))];
    const { data: listings, error: listErr } = await admin
      .from("cask_listings")
      .select("id, list_price, currency, spirit, spirit_name, cask_type, cask_size_litres, wood, abv, fill_date, status, stock_qty, reserved_qty, distilleries(name)")
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

    const currency = ((listings[0] as any)?.currency ?? "GBP").toString();

    let subtotal = 0;
    let total = 0;
    const itemRows = items.map((i) => {
      const l: any = listingMap.get(i.listing_id);
      const available = Math.max(0, (l.stock_qty ?? 0) - (l.reserved_qty ?? 0));
      const palletEligible = available >= PALLET_MIN_QTY && i.quantity >= PALLET_MIN_QTY;
      const pct = Math.max(codePercent, palletEligible ? PALLET_PCT : 0);
      const listPrice = Number(l.list_price);
      const unit = Math.round(listPrice * (1 - pct / 100) * 100) / 100;
      const lineTotal = Math.round(unit * i.quantity * 100) / 100;
      subtotal += listPrice * i.quantity;
      total += lineTotal;
      return {
        listing_id: l.id,
        distillery: l.distilleries?.name ?? null,
        spirit: l.spirit,
        spirit_name: l.spirit_name,
        cask_type: [l.cask_type, l.cask_size_litres ? `${Number(l.cask_size_litres)}L` : null].filter(Boolean).join(" ") || null,
        wood: l.wood,
        abv: l.abv,
        vintage_year: l.fill_date ? new Date(l.fill_date).getFullYear() : null,
        quantity: i.quantity,
        list_price: listPrice,
        unit_price: unit,
        line_total: lineTotal,
      };
    });
    subtotal = Math.round(subtotal * 100) / 100;
    total = Math.round(total * 100) / 100;
    const discountAmount = Math.round((subtotal - total) * 100) / 100;

    const { data: numberData, error: numErr } = await admin.rpc("next_invoice_number");
    if (numErr || !numberData) throw new Error("Could not generate invoice number");
    const invoiceNumber = numberData as string;
    const paymentReference = invoiceNumber;

    const clientName = [profile.title, profile.first_name, profile.last_name].filter(Boolean).join(" ");
    const dueAt = new Date(Date.now() + PAYMENT_TERMS_DAYS * 86400000).toISOString();

    const { data: invoice, error: invErr } = await admin
      .from("invoices")
      .insert({
        user_id: user.id,
        invoice_number: invoiceNumber,
        payment_reference: paymentReference,
        currency,
        subtotal,
        discount_amount: discountAmount,
        total,
        discount_code: discountCodeRaw,
        due_at: dueAt,
        bill_to: {
          name: clientName,
          email: profile.email,
          lines: [
            profile.address_line1,
            profile.address_line2,
            profile.address_city,
            profile.address_region,
            profile.address_postcode,
            profile.address_country,
          ].filter(Boolean),
        },
      })
      .select("*")
      .single();
    if (invErr || !invoice) throw new Error(invErr?.message || "Could not create invoice");

    const { error: itemsErr } = await admin
      .from("invoice_items")
      .insert(itemRows.map((r) => ({ ...r, invoice_id: invoice.id })));
    if (itemsErr) throw new Error(itemsErr.message);

    // Reserve stock for the hold period
    for (const r of itemRows) {
      await admin.rpc("reserve_listing_qty", { _listing_id: r.listing_id, _qty: r.quantity });
    }

    // Send the branded invoice email (non-blocking failure)
    try {
      await admin.functions.invoke("send-transactional-email", {
        body: {
          templateName: "invoice-bank-transfer",
          recipientEmail: profile.email,
          idempotencyKey: `invoice-${invoice.id}`,
          templateData: {
            firstName: profile.first_name,
            invoiceNumber,
            paymentReference,
            dueDate: new Date(dueAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
            currency,
            subtotal,
            discountAmount,
            total,
            items: itemRows.map((r) => ({
              title: r.distillery || r.spirit,
              detail: [r.cask_type, r.wood, r.abv ? `${r.abv}% ABV` : null, r.vintage_year].filter(Boolean).join(" · "),
              quantity: r.quantity,
              lineTotal: r.line_total,
            })),
            invoiceUrl: `${SITE_URL}/invoice/${invoice.confirmation_token}`,
            confirmUrl: `${SITE_URL}/invoice/${invoice.confirmation_token}?confirm=1`,
          },
        },
      });
    } catch (e) {
      console.error("invoice email failed", e);
    }

    return new Response(
      JSON.stringify({
        invoice_id: invoice.id,
        invoice_number: invoiceNumber,
        payment_reference: paymentReference,
        token: invoice.confirmation_token,
        due_at: dueAt,
        total,
        currency,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-invoice error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
