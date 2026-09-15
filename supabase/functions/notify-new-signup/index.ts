import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendAndLogTemplateEmail } from '../_shared/transactional-email-templates/send-and-log.ts'
import { pushToGHL } from '../_shared/gohighlevel.ts'

// Public endpoint (verify_jwt = false) — called from client signup form right
// after supabase.auth.signUp succeeds. Loads the newly-created profile and its
// approve/reject tokens (created by DB trigger) and enqueues the admin
// notification email. Safe to call multiple times; if tokens are missing (e.g.
// profile trigger not yet run) it returns 202 so signup UX isn't blocked.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const { email } = await req.json().catch(() => ({}))
    if (!email || typeof email !== 'string') {
      return json({ error: 'email required' }, 400)
    }

    // Always return the same generic response regardless of lookup outcome,
    // so this public endpoint cannot be used to enumerate which emails have
    // registered accounts or their approval status. Any failures are logged
    // server-side only.
    const generic = () => json({ status: 'ok' }, 202)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone, phone_country_code, country, status, created_at')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (!profile || profile.status !== 'pending') return generic()

    const { data: tokens } = await supabase
      .from('approval_tokens')
      .select('action, token')
      .eq('profile_id', profile.id)
      .is('used_at', null)

    const approve = tokens?.find((t) => t.action === 'approve')?.token
    const reject = tokens?.find((t) => t.action === 'reject')?.token
    if (!approve || !reject) return generic()

    const projectRef = new URL(Deno.env.get('SUPABASE_URL')!).host.split('.')[0]
    const fnBase = `https://${projectRef}.supabase.co/functions/v1/approve-client`
    const siteUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://www.altowhisky.com'
    const adminRecipient = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') ?? 'admin@altowhisky.com'

    const phone = [profile.phone_country_code, profile.phone].filter(Boolean).join(' ').trim()

    try {
      await sendAndLogTemplateEmail('admin-new-signup', adminRecipient, {
        idempotencyKey: `admin-new-signup-${profile.id}`,
        templateData: {
          clientName: `${profile.first_name} ${profile.last_name}`.trim() || profile.email,
          clientEmail: profile.email,
          clientPhone: phone,
          clientCountry: profile.country ?? '',
          signedUpAt: new Date(profile.created_at).toUTCString(),
          approveUrl: `${fnBase}?token=${approve}&action=approve`,
          rejectUrl: `${fnBase}?token=${reject}&action=reject`,
          adminUrl: `${siteUrl}/admin/clients`,
        },
      })
    } catch (sendErr) {
      console.error('notify-new-signup send failed', sendErr)
    }

    // Push the new signup to GoHighLevel as a contact (never blocks the flow).
    try {
      await pushToGHL({
        firstName: profile.first_name ?? '',
        lastName: profile.last_name ?? '',
        email: profile.email,
        phone,
        source: 'portal_signup',
        tags: ['Portal Signup'],
        submittedAt: new Date(profile.created_at).toISOString(),
      })
    } catch (ghlErr) {
      console.error('notify-new-signup GHL push failed', ghlErr)
    }
    return generic()
  } catch (e) {
    console.error('notify-new-signup error', e)
    return json({ status: 'ok' }, 202)
  }
})

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
