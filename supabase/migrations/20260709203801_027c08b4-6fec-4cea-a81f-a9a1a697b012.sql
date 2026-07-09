
-- Fix 1: Server-side price enforcement on orders (input_price_tampering)
CREATE OR REPLACE FUNCTION public.enforce_order_amount()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_list_price numeric;
  v_currency text;
  v_discount numeric;
  v_computed numeric;
BEGIN
  SELECT list_price, currency INTO v_list_price, v_currency
  FROM public.casks WHERE id = NEW.cask_id;

  IF v_list_price IS NULL THEN
    RAISE EXCEPTION 'Invalid cask';
  END IF;

  SELECT COALESCE(client_discount_pct, 0) INTO v_discount
  FROM public.profiles WHERE id = NEW.buyer_id;

  v_computed := ROUND(v_list_price * (1 - COALESCE(v_discount, 0) / 100.0), 2);

  NEW.amount := v_computed;
  NEW.currency := v_currency;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_enforce_amount ON public.orders;
CREATE TRIGGER orders_enforce_amount
BEFORE INSERT OR UPDATE OF amount, cask_id ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_amount();

-- Fix 2: Prevent profile self-escalation (profile_self_escalate)
CREATE OR REPLACE FUNCTION public.prevent_profile_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status := OLD.status;
  END IF;
  IF NEW.client_discount_pct IS DISTINCT FROM OLD.client_discount_pct THEN
    NEW.client_discount_pct := OLD.client_discount_pct;
  END IF;
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    NEW.email := OLD.email;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_escalation();
