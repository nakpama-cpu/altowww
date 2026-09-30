DROP POLICY "Distilleries readable by signed-in users" ON public.distilleries;

CREATE POLICY "Distilleries readable via listings, holdings or orders"
ON public.distilleries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.cask_listings l
    WHERE l.distillery_id = distilleries.id AND l.status = 'active'
  )
  OR EXISTS (
    SELECT 1 FROM public.casks c
    JOIN public.holdings h ON h.cask_id = c.id
    WHERE c.distillery_id = distilleries.id AND h.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.orders o
    LEFT JOIN public.casks c ON c.id = o.cask_id
    LEFT JOIN public.cask_listings l ON l.id = o.listing_id
    WHERE o.buyer_id = auth.uid()
      AND (c.distillery_id = distilleries.id OR l.distillery_id = distilleries.id)
  )
);