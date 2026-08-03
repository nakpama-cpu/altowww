-- Authoritative recompute of a listing's reserved quantity from pending invoices
CREATE OR REPLACE FUNCTION public.recompute_listing_reserved(_listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE v_pending integer;
BEGIN
  IF _listing_id IS NULL THEN RETURN; END IF;

  SELECT COALESCE(SUM(ii.quantity), 0) INTO v_pending
  FROM public.invoice_items ii
  JOIN public.invoices i ON i.id = ii.invoice_id
  WHERE ii.listing_id = _listing_id
    AND i.status IN ('awaiting_payment', 'client_confirmed');

  UPDATE public.cask_listings
     SET reserved_qty = GREATEST(0, v_pending),
         status = CASE
           WHEN GREATEST(0, v_pending) >= stock_qty THEN 'sold_out'::listing_status
           WHEN status = 'sold_out' AND GREATEST(0, v_pending) < stock_qty THEN 'active'::listing_status
           ELSE status
         END
   WHERE id = _listing_id;
END;
$$;

-- Keep stock/reservation figures correct whenever an invoice changes state
CREATE OR REPLACE FUNCTION public.trg_invoice_status_stock()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE r record;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status THEN
    RETURN NEW;
  END IF;

  IF NEW.status = 'paid' THEN
    -- Sold units leave inventory entirely
    FOR r IN SELECT listing_id, SUM(quantity) AS qty
             FROM public.invoice_items
             WHERE invoice_id = NEW.id AND listing_id IS NOT NULL
             GROUP BY listing_id LOOP
      UPDATE public.cask_listings
         SET stock_qty = GREATEST(0, stock_qty - r.qty)
       WHERE id = r.listing_id;
      PERFORM public.recompute_listing_reserved(r.listing_id);
    END LOOP;
  ELSIF NEW.status IN ('expired', 'cancelled') THEN
    FOR r IN SELECT DISTINCT listing_id
             FROM public.invoice_items
             WHERE invoice_id = NEW.id AND listing_id IS NOT NULL LOOP
      PERFORM public.recompute_listing_reserved(r.listing_id);
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoices_status_stock ON public.invoices;
CREATE TRIGGER trg_invoices_status_stock
AFTER UPDATE OF status ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.trg_invoice_status_stock();

-- One-off repair: remove already-sold units from stock, reset reservations to pending only
WITH sold AS (
  SELECT ii.listing_id, SUM(ii.quantity) AS qty
  FROM public.invoice_items ii
  JOIN public.invoices i ON i.id = ii.invoice_id
  WHERE i.status = 'paid' AND ii.listing_id IS NOT NULL
  GROUP BY ii.listing_id
)
UPDATE public.cask_listings l
   SET stock_qty = GREATEST(0, l.stock_qty - s.qty)
  FROM sold s
 WHERE l.id = s.listing_id;

DO $$
DECLARE l record;
BEGIN
  FOR l IN SELECT id FROM public.cask_listings LOOP
    PERFORM public.recompute_listing_reserved(l.id);
  END LOOP;
END $$;
