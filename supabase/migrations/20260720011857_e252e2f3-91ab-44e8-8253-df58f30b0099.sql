
-- Track Stripe checkout intent so orders are only created on payment success
CREATE TABLE public.checkout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id text NOT NULL UNIQUE,
  environment text NOT NULL DEFAULT 'sandbox',
  cart jsonb NOT NULL,
  discount_code text,
  subtotal numeric NOT NULL,
  discount_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL,
  currency text NOT NULL DEFAULT 'GBP',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.checkout_sessions TO authenticated;
GRANT ALL ON public.checkout_sessions TO service_role;

ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own checkout sessions"
  ON public.checkout_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_checkout_sessions_user ON public.checkout_sessions(user_id);
CREATE INDEX idx_checkout_sessions_stripe ON public.checkout_sessions(stripe_session_id);

CREATE TRIGGER trg_checkout_sessions_updated_at
  BEFORE UPDATE ON public.checkout_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Link paid orders back to their Stripe session
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent text;

CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_session_id);
