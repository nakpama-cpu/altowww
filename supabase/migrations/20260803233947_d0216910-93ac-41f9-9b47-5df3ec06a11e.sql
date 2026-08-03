REVOKE ALL ON FUNCTION public.trg_listing_stock_alert() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.trg_listing_stock_alert() TO service_role;