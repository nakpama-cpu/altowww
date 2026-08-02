DROP VIEW IF EXISTS public.cask_listings_client;

-- Restore client read access to listings (row level), but remove column access to internal stock fields.
DROP POLICY IF EXISTS "Admins view listings" ON public.cask_listings;
CREATE POLICY "Approved clients view active listings" ON public.cask_listings
  FOR SELECT
  USING (
    private.has_role(auth.uid(), 'admin'::public.app_role)
    OR (private.is_approved(auth.uid()) AND status = 'active')
  );

REVOKE SELECT ON public.cask_listings FROM authenticated;
GRANT SELECT (
  id, distillery_id, spirit, spirit_name, cask_type, cask_size_litres, wood,
  fill_date, abv, ola_litres, rla_litres, age_years, list_price, currency,
  description, hero_image_url, status, created_at, updated_at
) ON public.cask_listings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cask_listings TO authenticated;
GRANT ALL ON public.cask_listings TO service_role;

-- Approved clients / admins: derived availability only (no raw stock figures).
CREATE OR REPLACE FUNCTION public.listing_availability()
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

REVOKE ALL ON FUNCTION public.listing_availability() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.listing_availability() TO authenticated;

-- Admins only: full internal stock figures.
CREATE OR REPLACE FUNCTION public.admin_listing_stock()
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

REVOKE ALL ON FUNCTION public.admin_listing_stock() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_listing_stock() TO authenticated;