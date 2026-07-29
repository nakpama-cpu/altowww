
CREATE TYPE public.invoice_status AS ENUM ('awaiting_payment','client_confirmed','paid','cancelled','expired');

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number text NOT NULL UNIQUE,
  payment_reference text NOT NULL,
  status public.invoice_status NOT NULL DEFAULT 'awaiting_payment',
  currency text NOT NULL DEFAULT 'GBP',
  subtotal numeric NOT NULL DEFAULT 0,
  discount_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  discount_code text,
  bill_to jsonb NOT NULL DEFAULT '{}'::jsonb,
  issued_at timestamptz NOT NULL DEFAULT now(),
  due_at timestamptz NOT NULL DEFAULT (now() + interval '3 days'),
  confirmation_token text NOT NULL DEFAULT encode(extensions.gen_random_bytes(24),'hex'),
  client_confirmed_at timestamptz,
  client_note text,
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX invoices_confirmation_token_key ON public.invoices(confirmation_token);
CREATE INDEX invoices_user_id_idx ON public.invoices(user_id);

CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES public.cask_listings(id) ON DELETE SET NULL,
  distillery text,
  spirit text,
  spirit_name text,
  cask_type text,
  wood text,
  abv numeric,
  vintage_year integer,
  quantity integer NOT NULL DEFAULT 1,
  list_price numeric NOT NULL DEFAULT 0,
  unit_price numeric NOT NULL DEFAULT 0,
  line_total numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX invoice_items_invoice_id_idx ON public.invoice_items(invoice_id);

GRANT SELECT ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
GRANT SELECT ON public.invoice_items TO authenticated;
GRANT ALL ON public.invoice_items TO service_role;

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins manage invoices" ON public.invoices
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Clients view own invoice items" ON public.invoice_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.invoices i
    WHERE i.id = invoice_items.invoice_id
      AND (i.user_id = auth.uid() OR private.has_role(auth.uid(), 'admin'::public.app_role))
  ));

CREATE POLICY "Admins manage invoice items" ON public.invoice_items
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Invoice number generation: AW-YYYY-NNNN, resetting each calendar year.
CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_year text := to_char(now(), 'YYYY');
  v_seq integer;
BEGIN
  PERFORM pg_advisory_xact_lock(7700000000000002);
  SELECT COALESCE(MAX((split_part(invoice_number, '-', 3))::integer), 0) + 1
    INTO v_seq
  FROM public.invoices
  WHERE invoice_number LIKE 'AW-' || v_year || '-%';
  RETURN 'AW-' || v_year || '-' || lpad(v_seq::text, 4, '0');
END;
$$;

-- Reserve / release listing stock for invoices raised via bank transfer.
CREATE OR REPLACE FUNCTION public.reserve_listing_qty(_listing_id uuid, _qty integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.cask_listings
     SET reserved_qty = reserved_qty + _qty,
         status = CASE WHEN reserved_qty + _qty >= stock_qty THEN 'sold_out'::listing_status ELSE status END
   WHERE id = _listing_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_invoice_reservation(_invoice_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r record;
BEGIN
  FOR r IN SELECT listing_id, quantity FROM public.invoice_items WHERE invoice_id = _invoice_id AND listing_id IS NOT NULL LOOP
    UPDATE public.cask_listings
       SET reserved_qty = GREATEST(0, reserved_qty - r.quantity),
           status = CASE WHEN status = 'sold_out' AND (reserved_qty - r.quantity) < stock_qty THEN 'active'::listing_status ELSE status END
     WHERE id = r.listing_id;
  END LOOP;
END;
$$;

-- Expire unpaid invoices after their due date and release the reserved casks.
CREATE OR REPLACE FUNCTION public.expire_stale_invoices()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE inv record;
BEGIN
  FOR inv IN SELECT id FROM public.invoices
             WHERE status = 'awaiting_payment' AND due_at < now() LOOP
    PERFORM public.release_invoice_reservation(inv.id);
    UPDATE public.invoices SET status = 'expired' WHERE id = inv.id;
  END LOOP;
END;
$$;

SELECT cron.schedule('expire-stale-invoices', '0 * * * *', $cron$ SELECT public.expire_stale_invoices(); $cron$);
