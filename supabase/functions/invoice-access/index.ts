import { createClient } from "npm:@supabase/supabase-js@2";
import { buildInvoicePdf } from "../_shared/invoice-pdf.ts";
import { BANK, COMPANY, SITE_URL } from "../_shared/invoice-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const admin = () =>
  createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const isToken = (t: unknown): t is string => typeof t === "string" && /^[a-f0-9]{32,96}$/.test(t);

async function loadInvoice(token: string) {
  const db = admin();
  const { data: invoice } = await db.from("invoices").select("*").eq("confirmation_token", token).maybeSingle();
  if (!invoice) return null;
  const { data: items } = await db.from("invoice_items").select("*").eq("invoice_id", invoice.id);
  return { invoice, items: items ?? [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);

    // GET ?token=...&pdf=1  -> download PDF
    if (req.method === "GET") {
      const token = url.searchParams.get("token");
      if (!isToken(token)) return new Response("Not found", { status: 404, headers: corsHeaders });
      const loaded = await loadInvoice(token);
      if (!loaded) return new Response("Not found", { status: 404, headers: corsHeaders });
      const { invoice, items } = loaded;
      const bytes = await buildInvoicePdf({
        invoice_number: invoice.invoice_number,
        payment_reference: invoice.payment_reference,
        issued_at: invoice.issued_at,
        due_at: invoice.due_at,
        currency: invoice.currency,
        subtotal: Number(invoice.subtotal),
        discount_amount: Number(invoice.discount_amount),
        total: Number(invoice.total),
        discount_code: invoice.discount_code,
        bill_to: invoice.bill_to ?? {},
        items: items.map((i: any) => ({
          distillery: i.distillery,
          spirit: i.spirit,
          spirit_name: i.spirit_name,
          cask_type: i.cask_type,
          wood: i.wood,
          abv: i.abv,
          vintage_year: i.vintage_year,
          quantity: i.quantity,
          list_price: Number(i.list_price),
          unit_price: Number(i.unit_price),
          line_total: Number(i.line_total),
        })),
      });
      return new Response(bytes, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${invoice.invoice_number}.pdf"`,
        },
      });
    }

    const body = await req.json();
    const token = body?.token;
    if (!isToken(token)) throw new Error("Invalid invoice link");
    const loaded = await loadInvoice(token);
    if (!loaded) throw new Error("Invoice not found");
    const { invoice, items } = loaded;

    if (body?.action === "get") {
      return new Response(
        JSON.stringify({
          invoice: {
            invoice_number: invoice.invoice_number,
            payment_reference: invoice.payment_reference,
            status: invoice.status,
            currency: invoice.currency,
            subtotal: Number(invoice.subtotal),
            discount_amount: Number(invoice.discount_amount),
            total: Number(invoice.total),
            discount_code: invoice.discount_code,
            issued_at: invoice.issued_at,
            due_at: invoice.due_at,
            bill_to: invoice.bill_to,
            client_confirmed_at: invoice.client_confirmed_at,
          },
          items,
          bank: BANK,
          company: COMPANY,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (body?.action === "confirm") {
      if (invoice.status === "cancelled" || invoice.status === "expired") {
        throw new Error("This invoice is no longer active. Please contact us.");
      }
      const note = typeof body?.note === "string" ? body.note.slice(0, 500) : null;
      const db = admin();
      if (!invoice.client_confirmed_at) {
        await db
          .from("invoices")
          .update({
            status: invoice.status === "paid" ? "paid" : "client_confirmed",
            client_confirmed_at: new Date().toISOString(),
            client_note: note,
          })
          .eq("id", invoice.id);

        const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");
        if (adminEmail) {
          try {
            await db.functions.invoke("send-transactional-email", {
              body: {
                templateName: "admin-invoice-payment-confirmed",
                recipientEmail: adminEmail,
                idempotencyKey: `invoice-confirmed-${invoice.id}`,
                templateData: {
                  invoiceNumber: invoice.invoice_number,
                  paymentReference: invoice.payment_reference,
                  clientName: invoice.bill_to?.name ?? "",
                  clientEmail: invoice.bill_to?.email ?? "",
                  currency: invoice.currency,
                  total: Number(invoice.total),
                  note: note ?? "",
                  confirmedAt: new Date().toLocaleString("en-GB"),
                  items: items.map((i: any) => ({
                    title: i.distillery || i.spirit,
                    quantity: i.quantity,
                    lineTotal: Number(i.line_total),
                  })),
                  adminUrl: `${SITE_URL}/admin/invoices`,
                },
              },
            });
          } catch (e) {
            console.error("admin notify failed", e);
          }
        }
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Unknown action");
  } catch (e) {
    console.error("invoice-access error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
