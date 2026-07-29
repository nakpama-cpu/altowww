ALTER TABLE public.casks
  ADD COLUMN IF NOT EXISTS invoice_item_id uuid REFERENCES public.invoice_items(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS unit_index integer;

CREATE UNIQUE INDEX IF NOT EXISTS casks_invoice_item_unit_idx
  ON public.casks (invoice_item_id, unit_index)
  WHERE invoice_item_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.materialise_invoice_holdings(_invoice_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inv record;
  it record;
  li record;
  n integer;
  new_cask_id uuid;
BEGIN
  SELECT * INTO inv FROM public.invoices WHERE id = _invoice_id;
  IF inv IS NULL THEN RETURN; END IF;

  FOR it IN SELECT * FROM public.invoice_items WHERE invoice_id = _invoice_id LOOP
    SELECT * INTO li FROM public.cask_listings WHERE id = it.listing_id;

    FOR n IN 1..it.quantity LOOP
      IF EXISTS (SELECT 1 FROM public.casks c WHERE c.invoice_item_id = it.id AND c.unit_index = n) THEN
        CONTINUE;
      END IF;

      INSERT INTO public.casks (
        distillery_id, spirit, spirit_name, cask_type, wood, cask_size_litres,
        fill_date, abv, ola_litres, rla_litres, age_years,
        list_price, currency, status, description, hero_image_url,
        listing_id, invoice_item_id, unit_index
      )
      VALUES (
        li.distillery_id,
        COALESCE(li.spirit, 'Single Malt Scotch'),
        li.spirit_name,
        li.cask_type,
        li.wood,
        li.cask_size_litres,
        li.fill_date,
        li.abv,
        li.ola_litres,
        li.rla_litres,
        li.age_years,
        it.unit_price,
        inv.currency,
        'sold'::cask_status,
        li.description,
        li.hero_image_url,
        it.listing_id,
        it.id,
        n
      )
      RETURNING id INTO new_cask_id;

      INSERT INTO public.holdings (owner_id, cask_id, purchase_price, purchase_date)
      VALUES (inv.user_id, new_cask_id, it.unit_price, COALESCE(inv.paid_at, now())::date)
      ON CONFLICT (cask_id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.trg_invoice_paid_holdings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'paid') THEN
    PERFORM public.materialise_invoice_holdings(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoices_paid_holdings ON public.invoices;
CREATE TRIGGER trg_invoices_paid_holdings
AFTER INSERT OR UPDATE OF status ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.trg_invoice_paid_holdings();

DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT id FROM public.invoices WHERE status = 'paid' LOOP
    PERFORM public.materialise_invoice_holdings(r.id);
  END LOOP;
END $$;