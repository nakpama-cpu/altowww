CREATE OR REPLACE FUNCTION public.create_approval_tokens()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_catalog'
AS $function$
BEGIN
  IF NEW.status = 'pending' THEN
    INSERT INTO public.approval_tokens (profile_id, token, action)
    VALUES
      (NEW.id, encode(extensions.gen_random_bytes(24), 'hex'), 'approve'),
      (NEW.id, encode(extensions.gen_random_bytes(24), 'hex'), 'reject');
  END IF;
  RETURN NEW;
END;
$function$;