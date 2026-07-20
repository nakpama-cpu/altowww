-- Stop applying automatic per-client discounts; discount codes are now the only
-- discount mechanism in the client portal.

CREATE OR REPLACE FUNCTION public.enforce_order_amount()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_list_price numeric;
  v_currency text;
  v_effective numeric;
  v_computed numeric;
  v_code_id uuid;
  v_code_pct numeric;
  v_code_expires timestamptz;
  v_code_active boolean;
  v_redeemed timestamptz;
  v_assignment_id uuid;
BEGIN
  IF NEW.listing_id IS NOT NULL THEN
    SELECT list_price, currency INTO v_list_price, v_currency
    FROM public.cask_listings WHERE id = NEW.listing_id;
  ELSIF NEW.cask_id IS NOT NULL THEN
    SELECT list_price, currency INTO v_list_price, v_currency
    FROM public.casks WHERE id = NEW.cask_id;
  END IF;

  IF v_list_price IS NULL THEN
    RAISE EXCEPTION 'Invalid cask or listing';
  END IF;

  v_effective := 0;

  IF NEW.discount_code IS NOT NULL AND length(trim(NEW.discount_code)) > 0 THEN
    NEW.discount_code := upper(trim(NEW.discount_code));

    SELECT dc.id, dc.percent, dc.expires_at, dc.active
      INTO v_code_id, v_code_pct, v_code_expires, v_code_active
    FROM public.discount_codes dc
    WHERE upper(dc.code) = NEW.discount_code;

    IF v_code_id IS NULL THEN
      RAISE EXCEPTION 'Invalid discount code';
    END IF;
    IF NOT v_code_active THEN
      RAISE EXCEPTION 'Discount code is inactive';
    END IF;
    IF v_code_expires IS NOT NULL AND v_code_expires < now() THEN
      RAISE EXCEPTION 'Discount code has expired';
    END IF;

    SELECT id, redeemed_at INTO v_assignment_id, v_redeemed
    FROM public.discount_code_clients
    WHERE code_id = v_code_id AND user_id = NEW.buyer_id
    FOR UPDATE;

    IF v_assignment_id IS NULL THEN
      RAISE EXCEPTION 'Discount code not valid for this account';
    END IF;
    IF v_redeemed IS NOT NULL THEN
      RAISE EXCEPTION 'Discount code has already been used';
    END IF;

    v_effective := GREATEST(v_effective, v_code_pct);

    UPDATE public.discount_code_clients
       SET redeemed_at = now()
     WHERE id = v_assignment_id;
  END IF;

  v_computed := ROUND(v_list_price * (1 - v_effective / 100.0), 2);

  NEW.amount := v_computed;
  NEW.currency := v_currency;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_discount_code(_code text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_code_id uuid;
  v_pct numeric;
  v_expires timestamptz;
  v_active boolean;
  v_redeemed timestamptz;
  v_assigned boolean;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Not signed in');
  END IF;
  IF _code IS NULL OR length(trim(_code)) = 0 THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Enter a code');
  END IF;

  SELECT id, percent, expires_at, active
    INTO v_code_id, v_pct, v_expires, v_active
  FROM public.discount_codes
  WHERE upper(code) = upper(trim(_code));

  IF v_code_id IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Invalid discount code');
  END IF;
  IF NOT v_active THEN
    RETURN jsonb_build_object('valid', false, 'message', 'This code is inactive');
  END IF;
  IF v_expires IS NOT NULL AND v_expires < now() THEN
    RETURN jsonb_build_object('valid', false, 'message', 'This code has expired');
  END IF;

  SELECT redeemed_at, true INTO v_redeemed, v_assigned
  FROM public.discount_code_clients
  WHERE code_id = v_code_id AND user_id = v_uid;

  IF NOT COALESCE(v_assigned, false) THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Code not valid for this account');
  END IF;
  IF v_redeemed IS NOT NULL THEN
    RETURN jsonb_build_object('valid', false, 'message', 'Code has already been used');
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'code', upper(trim(_code)),
    'percent', v_pct,
    'effective_percent', v_pct
  );
END;
$$;
