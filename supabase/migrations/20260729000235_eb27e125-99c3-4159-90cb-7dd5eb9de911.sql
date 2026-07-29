
REVOKE ALL ON FUNCTION public.next_invoice_number() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reserve_listing_qty(uuid, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_invoice_reservation(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.expire_stale_invoices() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_invoice_number() TO service_role;
GRANT EXECUTE ON FUNCTION public.reserve_listing_qty(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.release_invoice_reservation(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.expire_stale_invoices() TO service_role;
