DROP FUNCTION IF EXISTS public.listing_availability();
DROP FUNCTION IF EXISTS public.admin_listing_stock();

CREATE OR REPLACE FUNCTION private.listing_availability()
RETURNS TABLE (listing_id uuid, available_qty integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.id, GREATEST(0, l.stock_qty - l.reserved_qty)::int
  FROM public.cask_listings l
  WHERE l.status = 'active'
    AND (
      private.has_role(auth.uid(), 'admin'::public.app_role)
      OR private.is_approved(auth.uid())
    );
$$;

CREATE OR REPLACE FUNCTION private.admin_listing_stock()
RETURNS TABLE (listing_id uuid, stock_qty integer, reserved_qty integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT l.id, l.stock_qty, l.reserved_qty
  FROM public.cask_listings l
  WHERE private.has_role(auth.uid(), 'admin'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.listing_availability()
RETURNS TABLE (listing_id uuid, available_qty integer)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT * FROM private.listing_availability();
$$;

CREATE OR REPLACE FUNCTION public.admin_listing_stock()
RETURNS TABLE (listing_id uuid, stock_qty integer, reserved_qty integer)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT * FROM private.admin_listing_stock();
$$;

REVOKE ALL ON FUNCTION public.listing_availability() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_listing_stock() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.listing_availability() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_listing_stock() TO authenticated;