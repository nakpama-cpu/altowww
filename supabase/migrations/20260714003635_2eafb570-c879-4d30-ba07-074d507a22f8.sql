ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS phone_country_code text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  is_first_user boolean;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles) INTO is_first_user;

  INSERT INTO public.profiles (id, email, first_name, last_name, phone, country, phone_country_code, status)
  VALUES (
    NEW.id,
    coalesce(NEW.email, ''),
    coalesce(NEW.raw_user_meta_data->>'first_name', ''),
    coalesce(NEW.raw_user_meta_data->>'last_name', ''),
    coalesce(NEW.raw_user_meta_data->>'phone', ''),
    coalesce(NEW.raw_user_meta_data->>'country', ''),
    coalesce(NEW.raw_user_meta_data->>'phone_country_code', ''),
    CASE WHEN is_first_user THEN 'approved'::public.profile_status ELSE 'pending'::public.profile_status END
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_first_user THEN 'admin'::public.app_role ELSE 'client'::public.app_role END);

  RETURN NEW;
END;
$$;