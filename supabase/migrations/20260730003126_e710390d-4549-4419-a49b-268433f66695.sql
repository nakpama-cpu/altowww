CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.mark_invoice_paid(_invoice_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  inv record;
  it record;
  n integer;
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;

  SELECT * INTO inv FROM public.invoices WHERE id = _invoice_id FOR UPDATE;
  IF inv IS NULL THEN RAISE EXCEPTION 'Invoice not found'; END IF;
  IF inv.status = 'paid' THEN RETURN; END IF;

  IF inv.status IN ('awaiting_payment', 'client_confirmed') THEN
    PERFORM public.release_invoice_reservation(_invoice_id);
  END IF;

  FOR it IN SELECT * FROM public.invoice_items WHERE invoice_id = _invoice_id LOOP
    FOR n IN 1..it.quantity LOOP
      INSERT INTO public.orders (buyer_id, listing_id, amount, currency, status, discount_code)
      VALUES (
        inv.user_id,
        it.listing_id,
        it.unit_price,
        inv.currency,
        'paid'::order_status,
        CASE WHEN n = 1 AND it.id = (SELECT id FROM public.invoice_items WHERE invoice_id = _invoice_id ORDER BY created_at LIMIT 1)
             THEN inv.discount_code ELSE NULL END
      );
    END LOOP;
  END LOOP;

  UPDATE public.invoices SET status = 'paid', paid_at = now() WHERE id = _invoice_id;
END;
$function$;

CREATE OR REPLACE FUNCTION private.cancel_invoice(_invoice_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE inv record;
BEGIN
  IF NOT private.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;

  SELECT * INTO inv FROM public.invoices WHERE id = _invoice_id FOR UPDATE;
  IF inv IS NULL THEN RAISE EXCEPTION 'Invoice not found'; END IF;
  IF inv.status IN ('cancelled', 'expired', 'paid') THEN RETURN; END IF;

  PERFORM public.release_invoice_reservation(_invoice_id);
  UPDATE public.invoices SET status = 'cancelled', cancelled_at = now() WHERE id = _invoice_id;
END;
$function$;

GRANT USAGE ON SCHEMA private TO authenticated;
REVOKE ALL ON FUNCTION private.mark_invoice_paid(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.cancel_invoice(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.mark_invoice_paid(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.cancel_invoice(uuid) TO authenticated, service_role;

-- Public API entry points are now SECURITY INVOKER thin wrappers
CREATE OR REPLACE FUNCTION public.mark_invoice_paid(_invoice_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM private.mark_invoice_paid(_invoice_id);
END;
$function$;

CREATE OR REPLACE FUNCTION public.cancel_invoice(_invoice_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM private.cancel_invoice(_invoice_id);
END;
$function$;

REVOKE ALL ON FUNCTION public.mark_invoice_paid(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cancel_invoice(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_invoice_paid(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.cancel_invoice(uuid) TO authenticated, service_role;