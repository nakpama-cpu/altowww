-- Restrict raw internal stock fields on cask_listings to admins only.
DROP POLICY IF EXISTS "Approved clients view active listings" ON public.cask_listings;

CREATE POLICY "Admins view listings" ON public.cask_listings
  FOR SELECT
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- Client-facing view: no raw stock_qty/reserved_qty, only derived availability.
CREATE OR REPLACE VIEW public.cask_listings_client
WITH (security_invoker = false) AS
SELECT
  l.id,
  l.distillery_id,
  l.spirit,
  l.spirit_name,
  l.cask_type,
  l.cask_size_litres,
  l.wood,
  l.fill_date,
  l.abv,
  l.ola_litres,
  l.rla_litres,
  l.age_years,
  l.list_price,
  l.currency,
  l.description,
  l.hero_image_url,
  l.status,
  l.created_at,
  l.updated_at,
  GREATEST(0, l.stock_qty - l.reserved_qty) AS available_qty
FROM public.cask_listings l
WHERE l.status = 'active'
  AND (private.is_approved(auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

REVOKE ALL ON public.cask_listings_client FROM anon;
GRANT SELECT ON public.cask_listings_client TO authenticated;
GRANT SELECT ON public.cask_listings_client TO service_role;

-- checkout_sessions: writes are server-side only (edge functions via service role).
-- Make that explicit and deny client writes.
REVOKE INSERT, UPDATE, DELETE ON public.checkout_sessions FROM authenticated;
GRANT ALL ON public.checkout_sessions TO service_role;