-- Allow authenticated clients to read only discount codes assigned to them.
CREATE POLICY "Clients read codes assigned to them"
  ON public.discount_codes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.discount_code_clients dcc
      WHERE dcc.code_id = discount_codes.id
        AND dcc.user_id = auth.uid()
    )
  );

-- Rewrite validate_discount_code as SECURITY INVOKER; RLS now controls visibility.
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