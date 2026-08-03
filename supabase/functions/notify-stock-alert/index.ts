import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

// Called by the database trigger (service-role bearer) when a listing's
// available quantity first drops to the low threshold or to zero.
// verify_jwt = false, so the service-role bearer is checked manually.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const bearer = req.headers.get('Authorization')?.replace('Bearer ', '').trim()
  if (!bearer || bearer !== serviceKey) return json({ error: 'Unauthorized' }, 401)

  try {
    const { listing_id, state, available } = await req.json().catch(() => ({}))
    if (!listing_id || (state !== 'low' && state !== 'out')) return json({ error: 'bad payload' }, 400)

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey)

    const { data: listing } = await supabase
      .from('cask_listings')
      .select('id, spirit, spirit_name, cask_type, cask_size_litres, wood, abv, fill_date, stock_qty, reserved_qty, distilleries(name)')
      .eq('id', listing_id)
      .maybeSingle()
    if (!listing) return json({ status: 'ok' }, 202)

    const l: any = listing
    const distillery = l.distilleries?.name ?? l.spirit_name ?? l.spirit ?? 'Cask listing'
    const caskSpec = [l.wood, l.cask_type, l.cask_size_litres ? `${Number(l.cask_size_litres)}L` : null]
      .filter(Boolean).join(' ')
    const year = l.fill_date ? new Date(l.fill_date).getFullYear() : null
    const specLine = [year, caskSpec || null, l.abv ? `ABV ${l.abv}% Approx` : null].filter(Boolean).join('  ·  ')

    const siteUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://www.altowhisky.com'
    const adminRecipient = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') ?? 'admin@altowhisky.com'
    const avail = Number(available ?? Math.max(0, (l.stock_qty ?? 0) - (l.reserved_qty ?? 0)))

    const { error: sendErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'admin-low-stock',
        recipientEmail: adminRecipient,
        idempotencyKey: `stock-alert-${listing_id}-${state}-${avail}-${new Date().toISOString().slice(0, 10)}`,
        templateData: {
          state,
          distillery,
          specLine,
          available: avail,
          stockQty: l.stock_qty ?? 0,
          reservedQty: l.reserved_qty ?? 0,
          adminUrl: `${siteUrl}/admin/stock-alerts`,
        },
      },
    })
    if (sendErr) console.error('stock alert email failed', sendErr)

    return json({ status: 'ok' })
  } catch (e) {
    console.error('notify-stock-alert error', e)
    return json({ error: 'Unexpected error' }, 500)
  }
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
