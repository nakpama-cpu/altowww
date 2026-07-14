import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, phone, phone_country_code, country, status, created_at')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle()

    if (!profile) return json({ status: 'no_profile' }, 202)
    if (profile.status !== 'pending') return json({ status: 'not_pending' }, 202)

    const { data: tokens } = await supabase
      .from('approval_tokens')
      .select('action, token')
      .eq('profile_id', profile.id)
      .is('used_at', null)

    const approve = tokens?.find((t) => t.action === 'approve')?.token
    const reject = tokens?.find((t) => t.action === 'reject')?.token
    if (!approve || !reject) return json({ status: 'no_tokens' }, 202)

    const projectRef = new URL(Deno.env.get('SUPABASE_URL')!).host.split('.')[0]
    const fnBase = `https://${projectRef}.supabase.co/functions/v1/approve-client`
    const siteUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://www.altowhisky.com'
    const adminRecipient = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') ?? 'admin@altowhisky.com'

    const phone = [profile.phone_country_code, profile.phone].filter(Boolean).join(' ').trim()

    const { error: sendErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'admin-new-signup',
        recipientEmail: adminRecipient,
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
      },
    })

    if (sendErr) {
      console.error('notify-new-signup send failed', sendErr)
      return json({ status: 'send_failed', error: sendErr.message }, 500)
    }
    return json({ status: 'ok' }, 200)
  } catch (e) {
    console.error('notify-new-signup error', e)
    return json({ error: (e as Error).message }, 500)
  }
})

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
