import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

// Public HTTP endpoint (verify_jwt = false). Reached by clicking approve/reject
// buttons in the admin notification email. Validates the single-use token,
// updates the profile's status, marks the token used, and (on approve) sends
// the client an approval email. Renders a small branded HTML confirmation.

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const url = new URL(req.url)
  const token = url.searchParams.get('token') ?? ''
  const action = url.searchParams.get('action') ?? ''

  if (!token || (action !== 'approve' && action !== 'reject')) {
    return page('Invalid link', 'This approval link is malformed.', false)
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { data: row } = await supabase
    .from('approval_tokens')
    .select('id, profile_id, action, expires_at, used_at')
    .eq('token', token)
    .maybeSingle()

  if (!row || row.action !== action) {
    return page('Link not recognised', 'This approval link is invalid or has been revoked.', false)
  }
  if (row.used_at) {
    return page('Already actioned', 'This client has already been reviewed. No further action is needed.', true)
  }
  if (new Date(row.expires_at) < new Date()) {
    return page('Link expired', 'This approval link has expired. Please action the client from the admin console.', false)
  }

  const newStatus = action === 'approve' ? 'approved' : 'suspended'

  const { data: profile, error: updErr } = await supabase
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', row.profile_id)
    .select('first_name, email')
    .maybeSingle()

  if (updErr || !profile) {
    console.error('approve-client update failed', updErr)
    return page('Something went wrong', 'We could not update this client. Please try again from the admin console.', false)
  }

  // Invalidate all outstanding tokens for this profile
  await supabase
    .from('approval_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('profile_id', row.profile_id)
    .is('used_at', null)

  if (action === 'approve') {
    const siteUrl = Deno.env.get('PUBLIC_SITE_URL') ?? 'https://www.altowhisky.com'
    const { error: sendErr } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'client-approved',
        recipientEmail: profile.email,
        idempotencyKey: `client-approved-${row.profile_id}`,
        templateData: {
          firstName: profile.first_name || 'there',
          loginUrl: `${siteUrl}/portal/login`,
        },
      },
    })
    if (sendErr) console.error('approve-client send failed', sendErr)
    return page('Client approved', `${profile.email} has been approved and notified by email.`, true)
  }

  return page('Client rejected', `${profile.email} has been marked as suspended. They have not been emailed.`, true)
})

function page(title: string, body: string, ok: boolean) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(title)} — Alto Whisky</title>
<style>
  body { margin:0; font-family: 'Inter', Arial, sans-serif; background: hsl(40,10%,96%); color: hsl(220,26%,14%); min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
  .card { background:#fff; max-width:480px; width:100%; padding:40px 32px; border:1px solid hsl(0,0%,88%); text-align:center; }
  .badge { display:inline-block; font-size:11px; letter-spacing:.25em; text-transform:uppercase; color: ${ok ? 'hsl(24,72%,40%)' : 'hsl(0,60%,45%)'}; margin-bottom:16px; font-weight:600; }
  h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight:500; font-size:30px; margin:0 0 16px; }
  p { font-size:15px; line-height:1.6; color: hsl(0,0%,30%); margin:0 0 24px; }
  a { display:inline-block; background: hsl(220,26%,14%); color:#fff; padding:12px 24px; text-decoration:none; font-size:12px; letter-spacing:.2em; text-transform:uppercase; font-weight:600; }
</style></head>
<body><div class="card">
  <div class="badge">${ok ? 'Alto Whisky' : 'Alto Whisky'}</div>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(body)}</p>
  <a href="https://www.altowhisky.com/admin/clients">Open admin console</a>
</div></body></html>`
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
