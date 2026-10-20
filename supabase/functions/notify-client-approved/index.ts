import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendAndLogTemplateEmail } from '../_shared/transactional-email-templates/send-and-log.ts'

// Called by the admin console after an admin approves a pending client.
// The caller must be an authenticated admin; the recipient is derived from the
// profile row, never from the request body.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const authHeader = req.headers.get('Authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) return json({ error: 'Unauthorized' }, 401)

  const admin = createClient(supabaseUrl, serviceKey)

  const { data: userData, error: userErr } = await admin.auth.getUser(token)
  if (userErr || !userData?.user) return json({ error: 'Unauthorized' }, 401)

  const { data: roleRow } = await admin
    .from('user_roles')
    .select('role')
    .eq('user_id', userData.user.id)
    .eq('role', 'admin')
    .maybeSingle()
  if (!roleRow) return json({ error: 'Forbidden' }, 403)

  const { profile_id: profileId } = await req.json().catch(() => ({}))
  if (!profileId || typeof profileId !== 'string') {
    return json({ error: 'profile_id is required' }, 400)
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('id, first_name, email, status')
    .eq('id', profileId)
    .maybeSingle()

  if (!profile || profile.status !== 'approved') {
    return json({ error: 'Profile not found or not approved' }, 404)
  }

  const siteUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://www.altowhisky.com'

  try {
    const result = await sendAndLogTemplateEmail('client-approved', profile.email, {
      idempotencyKey: `client-approved-${profile.id}`,
      templateData: {
        firstName: profile.first_name || 'there',
        loginUrl: `${siteUrl}/portal/login`,
      },
    })
    return json({ success: true, sent: result.sent })
  } catch (e) {
    console.error('notify-client-approved send failed', e)
    return json({ error: 'Failed to send email' }, 500)
  }
})

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
