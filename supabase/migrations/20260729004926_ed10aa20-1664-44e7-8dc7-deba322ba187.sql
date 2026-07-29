ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

CREATE UNIQUE INDEX IF NOT EXISTS invoices_stripe_session_id_key
  ON public.invoices (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;