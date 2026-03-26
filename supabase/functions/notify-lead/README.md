# notify-lead — Supabase Edge Function

Fires on every new lead INSERT, sending two emails via Resend:
1. **Confirmation** to the prospect (branded Alto email, 3 key investment facts, CTA)
2. **Hot-lead alert** to Nick (name, email, phone, source, message, timestamp)

## Deploy

```bash
# One-time: install Supabase CLI and link project
npm install -g supabase
supabase login
supabase link --project-ref feyyzyzgtcxsuyganmkn

# Deploy the function
supabase functions deploy notify-lead --no-verify-jwt

# Set secrets (do this ONCE — stored securely in Supabase)
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
supabase secrets set ALTO_NOTIFY_EMAIL=nick@altowhisky.com
supabase secrets set ALTO_FROM_EMAIL=noreply@altowhisky.com
```

## Wire Up the Database Webhook

In the Supabase Dashboard → Database → Webhooks → Create new webhook:

| Field | Value |
|---|---|
| Name | `on_new_lead` |
| Table | `public.leads` |
| Events | `INSERT` |
| Method | `POST` |
| URL | `https://feyyzyzgtcxsuyganmkn.supabase.co/functions/v1/notify-lead` |
| HTTP Headers | `Authorization: Bearer <your-anon-key>` |

That's it. Every lead that hits the DB will now trigger both emails instantly.

## Required: Resend Setup

1. Sign up at https://resend.com (free tier: 3,000 emails/month)
2. Verify your sending domain (`altowhisky.com`) in Resend DNS settings
3. Create an API key → copy it → run `supabase secrets set RESEND_API_KEY=re_xxx`

## Environment Variables

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key (required) |
| `ALTO_NOTIFY_EMAIL` | Where Nick's hot-lead alerts go (default: nick@altowhisky.com) |
| `ALTO_FROM_EMAIL` | Sender address — must be verified in Resend (default: noreply@altowhisky.com) |
