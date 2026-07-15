CREATE OR REPLACE FUNCTION public.normalize_profile_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.first_name IS NOT NULL THEN
    NEW.first_name := initcap(lower(regexp_replace(trim(NEW.first_name), '\s+', ' ', 'g')));
  END IF;
  IF NEW.last_name IS NOT NULL THEN
    NEW.last_name := initcap(lower(regexp_replace(trim(NEW.last_name), '\s+', ' ', 'g')));
  END IF;
  IF NEW.email IS NOT NULL THEN
    NEW.email := lower(trim(NEW.email));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_normalize_fields ON public.profiles;
CREATE TRIGGER profiles_normalize_fields
  BEFORE INSERT OR UPDATE OF first_name, last_name, email
  ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_profile_fields();

-- Backfill existing rows without triggering the escalation guard
ALTER TABLE public.profiles DISABLE TRIGGER USER;
UPDATE public.profiles
SET first_name = initcap(lower(regexp_replace(trim(coalesce(first_name,'')), '\s+', ' ', 'g'))),
    last_name  = initcap(lower(regexp_replace(trim(coalesce(last_name,'')),  '\s+', ' ', 'g'))),
    email      = lower(trim(coalesce(email,'')));
ALTER TABLE public.profiles ENABLE TRIGGER USER;
