ALTER TABLE public.profiles DISABLE TRIGGER prevent_profile_escalation_trg;
ALTER TABLE public.profiles DISABLE TRIGGER profiles_prevent_escalation;
UPDATE public.profiles SET
  address_verification_status = 'verified',
  age_verification_status = 'verified',
  address_verified_at = now(),
  age_verified_at = now()
WHERE email = 'test@altowhisky.com';
ALTER TABLE public.profiles ENABLE TRIGGER prevent_profile_escalation_trg;
ALTER TABLE public.profiles ENABLE TRIGGER profiles_prevent_escalation;