REVOKE ALL ON FUNCTION public.recompute_listing_reserved(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.trg_invoice_status_stock() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recompute_listing_reserved(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.trg_invoice_status_stock() TO service_role;
