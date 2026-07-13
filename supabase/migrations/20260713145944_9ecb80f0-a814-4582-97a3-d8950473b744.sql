
DROP TRIGGER IF EXISTS enforce_order_amount_trg ON public.orders;
CREATE TRIGGER enforce_order_amount_trg
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.enforce_order_amount();

DROP TRIGGER IF EXISTS prevent_profile_escalation_trg ON public.profiles;
CREATE TRIGGER prevent_profile_escalation_trg
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_escalation();
