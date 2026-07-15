
-- 1. Listing status enum
DO $$ BEGIN
  CREATE TYPE public.listing_status AS ENUM ('active', 'hidden', 'sold_out');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. cask_listings table
CREATE TABLE public.cask_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  distillery_id uuid REFERENCES public.distilleries(id) ON DELETE SET NULL,
  spirit text NOT NULL DEFAULT 'Single Malt Scotch',
  cask_type text,
  fill_date date,
  abv numeric(5,2),
  ola_litres numeric(8,2),
  rla_litres numeric(8,2),
  age_years integer,
  list_price numeric(12,2),
  currency text NOT NULL DEFAULT 'GBP',
  description text,
  hero_image_url text,
  stock_qty integer NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
  reserved_qty integer NOT NULL DEFAULT 0 CHECK (reserved_qty >= 0),
  status public.listing_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cask_listings TO authenticated;
GRANT ALL ON public.cask_listings TO service_role;

ALTER TABLE public.cask_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage listings" ON public.cask_listings
  FOR ALL
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Approved clients view active listings" ON public.cask_listings
  FOR SELECT
  USING (
    private.has_role(auth.uid(), 'admin'::public.app_role)
    OR (private.is_approved(auth.uid()) AND status = 'active')
  );

CREATE TRIGGER trg_cask_listings_updated
  BEFORE UPDATE ON public.cask_listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Alter casks: add listing_id, drop NOT NULL on cask_number
ALTER TABLE public.casks
  ADD COLUMN listing_id uuid REFERENCES public.cask_listings(id) ON DELETE SET NULL,
  ALTER COLUMN cask_number DROP NOT NULL;

-- 4. Alter orders: add listing_id, drop NOT NULL on cask_id
ALTER TABLE public.orders
  ADD COLUMN listing_id uuid REFERENCES public.cask_listings(id) ON DELETE RESTRICT,
  ALTER COLUMN cask_id DROP NOT NULL,
  ADD CONSTRAINT orders_target_present CHECK (listing_id IS NOT NULL OR cask_id IS NOT NULL);

-- 5. Wipe existing 'available' individual casks (no holdings/orders reference these)
DELETE FROM public.casks WHERE status = 'available';

-- 6. Update enforce_order_amount to support listing-based orders
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

-- Recreate the enforce trigger so it watches the new column too
DROP TRIGGER IF EXISTS orders_enforce_amount ON public.orders;
CREATE TRIGGER orders_enforce_amount
  BEFORE INSERT OR UPDATE OF amount, cask_id, listing_id ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.enforce_order_amount();

-- 7. Reservation bumping trigger for listings
CREATE OR REPLACE FUNCTION public.bump_listing_reserved()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.listing_id IS NOT NULL THEN
      UPDATE public.cask_listings
        SET reserved_qty = reserved_qty + 1,
            status = CASE WHEN reserved_qty + 1 >= stock_qty THEN 'sold_out'::listing_status ELSE status END
        WHERE id = NEW.listing_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.listing_id IS NOT NULL THEN
      UPDATE public.cask_listings
        SET reserved_qty = GREATEST(0, reserved_qty - 1),
            status = CASE
              WHEN status = 'sold_out' AND (reserved_qty - 1) < stock_qty THEN 'active'::listing_status
              ELSE status
            END
        WHERE id = OLD.listing_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

DROP TRIGGER IF EXISTS orders_bump_listing_reserved_ins ON public.orders;
CREATE TRIGGER orders_bump_listing_reserved_ins
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.bump_listing_reserved();

DROP TRIGGER IF EXISTS orders_bump_listing_reserved_del ON public.orders;
CREATE TRIGGER orders_bump_listing_reserved_del
  AFTER DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.bump_listing_reserved();
