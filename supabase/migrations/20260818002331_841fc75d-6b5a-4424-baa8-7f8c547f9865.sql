CREATE OR REPLACE FUNCTION private.cancel_my_invoice(_invoice_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE inv record;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;

  SELECT * INTO inv FROM public.invoices WHERE id = _invoice_id FOR UPDATE;
  IF inv IS NULL THEN RAISE EXCEPTION 'Invoice not found'; END IF;
  IF inv.user_id <> auth.uid() THEN RAISE EXCEPTION 'Not authorised'; END IF;
  IF inv.status IN ('cancelled', 'expired', 'paid') THEN RETURN; END IF;

  PERFORM public.release_invoice_reservation(_invoice_id);
  UPDATE public.invoices SET status = 'cancelled', cancelled_at = now() WHERE id = _invoice_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cancel_my_invoice(_invoice_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM private.cancel_my_invoice(_invoice_id);
END;
$function$;

REVOKE ALL ON FUNCTION public.cancel_my_invoice(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_my_invoice(uuid) TO authenticated;