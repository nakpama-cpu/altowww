CREATE TABLE public.stock_alerts (
  listing_id uuid PRIMARY KEY REFERENCES public.cask_listings(id) ON DELETE CASCADE,
  state text NOT NULL CHECK (state IN ('ok','low','out')),
  available_qty integer NOT NULL DEFAULT 0,
  notified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.stock_alerts TO authenticated;
GRANT ALL ON public.stock_alerts TO service_role;

ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view stock alerts"
ON public.stock_alerts FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER trg_stock_alerts_updated
BEFORE UPDATE ON public.stock_alerts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.trg_listing_stock_alert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_avail integer;
  v_state text;
  v_prev text;
BEGIN
  v_avail := GREATEST(0, COALESCE(NEW.stock_qty,0) - COALESCE(NEW.reserved_qty,0));
  v_state := CASE WHEN v_avail = 0 THEN 'out' WHEN v_avail <= 3 THEN 'low' ELSE 'ok' END;

  SELECT state INTO v_prev FROM public.stock_alerts WHERE listing_id = NEW.id;

  IF v_prev IS NOT DISTINCT FROM v_state THEN
    UPDATE public.stock_alerts SET available_qty = v_avail WHERE listing_id = NEW.id;
    RETURN NEW;
  END IF;

  INSERT INTO public.stock_alerts (listing_id, state, available_qty, notified_at)
  VALUES (NEW.id, v_state, v_avail, CASE WHEN v_state = 'ok' THEN NULL ELSE now() END)
  ON CONFLICT (listing_id) DO UPDATE
    SET state = EXCLUDED.state,
        available_qty = EXCLUDED.available_qty,
        notified_at = CASE WHEN EXCLUDED.state = 'ok' THEN NULL ELSE now() END;

  IF v_state <> 'ok' THEN
    BEGIN
      PERFORM net.http_post(
        url := 'https://feyyzyzgtcxsuyganmkn.supabase.co/functions/v1/notify-stock-alert',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (
            SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key'
          )
        ),
        body := jsonb_build_object('listing_id', NEW.id, 'state', v_state, 'available', v_avail)
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'stock alert notify failed: %', SQLERRM;
    END;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_cask_listings_stock_alert
AFTER INSERT OR UPDATE OF stock_qty, reserved_qty ON public.cask_listings
FOR EACH ROW EXECUTE FUNCTION public.trg_listing_stock_alert();

-- Seed current state without emailing
INSERT INTO public.stock_alerts (listing_id, state, available_qty, notified_at)
SELECT id,
       CASE WHEN GREATEST(0, stock_qty - reserved_qty) = 0 THEN 'out'
            WHEN GREATEST(0, stock_qty - reserved_qty) <= 3 THEN 'low'
            ELSE 'ok' END,
       GREATEST(0, stock_qty - reserved_qty),
       NULL
FROM public.cask_listings
ON CONFLICT (listing_id) DO NOTHING;