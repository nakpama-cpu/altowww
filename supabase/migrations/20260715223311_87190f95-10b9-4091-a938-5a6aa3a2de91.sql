CREATE OR REPLACE FUNCTION public.prevent_profile_escalation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF private.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN NEW.status := OLD.status; END IF;
  IF NEW.client_discount_pct IS DISTINCT FROM OLD.client_discount_pct THEN NEW.client_discount_pct := OLD.client_discount_pct; END IF;
  IF NEW.email IS DISTINCT FROM OLD.email THEN NEW.email := OLD.email; END IF;

  IF NEW.address_verified_at IS DISTINCT FROM OLD.address_verified_at THEN NEW.address_verified_at := OLD.address_verified_at; END IF;
  IF NEW.age_verified_at IS DISTINCT FROM OLD.age_verified_at THEN NEW.age_verified_at := OLD.age_verified_at; END IF;

  -- Client can transition their own verification status only to not_submitted or pending
  -- (e.g. resubmitting after an update). Admin-only states (verified/rejected) can't be self-assigned.
  IF NEW.address_verification_status IS DISTINCT FROM OLD.address_verification_status THEN
    IF NEW.address_verification_status NOT IN ('not_submitted', 'pending') THEN
      NEW.address_verification_status := OLD.address_verification_status;
    END IF;
  END IF;
  IF NEW.age_verification_status IS DISTINCT FROM OLD.age_verification_status THEN
    IF NEW.age_verification_status NOT IN ('not_submitted', 'pending') THEN
      NEW.age_verification_status := OLD.age_verification_status;
    END IF;
  END IF;
  IF NEW.verification_notes IS DISTINCT FROM OLD.verification_notes THEN NEW.verification_notes := OLD.verification_notes; END IF;

  -- Once identity (age) is verified, lock legal-identity fields permanently.
  -- Name, title, and DOB establish who the client legally is on the KYC record.
  IF OLD.age_verification_status = 'verified' THEN
    NEW.title := OLD.title;
    NEW.first_name := OLD.first_name;
    NEW.last_name := OLD.last_name;
    NEW.date_of_birth := OLD.date_of_birth;
    NEW.proof_of_age_path := OLD.proof_of_age_path;
    NEW.proof_of_age_type := OLD.proof_of_age_type;
  END IF;

  -- Address and phone remain editable even once verified — updating address will
  -- require re-verification, which the client-side flow handles by resetting
  -- address_verification_status back to 'pending' with a fresh document.

  RETURN NEW;
END;
$function$;