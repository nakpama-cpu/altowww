
CREATE TABLE public.discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  percent numeric(5,2) NOT NULL CHECK (percent > 0 AND percent <= 100),
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_discount_codes_code_lower ON public.discount_codes (lower(code));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.discount_codes TO authenticated;
GRANT ALL ON public.discount_codes TO service_role;

ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage discount codes"
  ON public.discount_codes FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER trg_discount_codes_updated
  BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.discount_code_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid NOT NULL REFERENCES public.discount_codes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (code_id, user_id)
);
CREATE INDEX idx_dcc_user ON public.discount_code_clients (user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.discount_code_clients TO authenticated;
GRANT ALL ON public.discount_code_clients TO service_role;

ALTER TABLE public.discount_code_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage code assignments"
  ON public.discount_code_clients FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Clients see their own assignments"
  ON public.discount_code_clients FOR SELECT TO authenticated
  USING (user_id = auth.uid());

ALTER TABLE public.orders ADD COLUMN discount_code text;

CREATE OR REPLACE FUNCTION public.enforce_order_amount()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_list_price numeric;
  v_currency text;
  v_discount numeric;
  v_effective numeric;
  v_computed numeric;
  v_code_id uuid;
  v_code_pct numeric;
  v_code_expires timestamptz;
  v_code_active boolean;
  v_redeemed timestamptz;
  v_assignment_id uuid;
BEGIN
  SELECT list_price, currency INTO v_list_price, v_currency
  FROM public.casks WHERE id = NEW.cask_id;

  IF v_list_price IS NULL THEN
    RAISE EXCEPTION 'Invalid cask';
  END IF;

  SELECT COALESCE(client_discount_pct, 0) INTO v_discount
  FROM public.profiles WHERE id = NEW.buyer_id;

  v_effective := COALESCE(v_discount, 0);

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
SECURITY DEFINER
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
  v_profile_pct numeric;
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

  SELECT COALESCE(client_discount_pct, 0) INTO v_profile_pct
  FROM public.profiles WHERE id = v_uid;

  RETURN jsonb_build_object(
    'valid', true,
    'code', upper(trim(_code)),
    'percent', v_pct,
    'profile_percent', v_profile_pct,
    'effective_percent', GREATEST(COALESCE(v_profile_pct, 0), v_pct)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_discount_code(text) TO authenticated;
