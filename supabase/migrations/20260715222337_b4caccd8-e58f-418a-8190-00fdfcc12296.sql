
CREATE TYPE public.proof_of_address_type AS ENUM ('utility_bill', 'bank_statement', 'driving_licence', 'council_tax', 'other');
CREATE TYPE public.proof_of_age_type AS ENUM ('passport', 'driving_licence', 'national_id');
CREATE TYPE public.verification_status AS ENUM ('not_submitted', 'pending', 'verified', 'rejected');

ALTER TABLE public.profiles
  ADD COLUMN date_of_birth date,
  ADD COLUMN address_line1 text,
  ADD COLUMN address_line2 text,
  ADD COLUMN address_city text,
  ADD COLUMN address_region text,
  ADD COLUMN address_postcode text,
  ADD COLUMN address_country text,
  ADD COLUMN proof_of_address_path text,
  ADD COLUMN proof_of_address_type public.proof_of_address_type,
  ADD COLUMN proof_of_address_issued_on date,
  ADD COLUMN proof_of_age_path text,
  ADD COLUMN proof_of_age_type public.proof_of_age_type,
  ADD COLUMN address_verified_at timestamptz,
  ADD COLUMN age_verified_at timestamptz,
  ADD COLUMN address_verification_status public.verification_status NOT NULL DEFAULT 'not_submitted',
  ADD COLUMN age_verification_status public.verification_status NOT NULL DEFAULT 'not_submitted',
  ADD COLUMN verification_notes text;

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
  IF NEW.address_verification_status IS DISTINCT FROM OLD.address_verification_status THEN
    IF OLD.address_verification_status = 'verified'
       OR NEW.address_verification_status NOT IN ('not_submitted', 'pending') THEN
      NEW.address_verification_status := OLD.address_verification_status;
    END IF;
  END IF;
  IF NEW.age_verification_status IS DISTINCT FROM OLD.age_verification_status THEN
    IF OLD.age_verification_status = 'verified'
       OR NEW.age_verification_status NOT IN ('not_submitted', 'pending') THEN
      NEW.age_verification_status := OLD.age_verification_status;
    END IF;
  END IF;
  IF NEW.verification_notes IS DISTINCT FROM OLD.verification_notes THEN NEW.verification_notes := OLD.verification_notes; END IF;

  IF OLD.address_verification_status = 'verified' THEN
    NEW.address_line1 := OLD.address_line1;
    NEW.address_line2 := OLD.address_line2;
    NEW.address_city := OLD.address_city;
    NEW.address_region := OLD.address_region;
    NEW.address_postcode := OLD.address_postcode;
    NEW.address_country := OLD.address_country;
    NEW.proof_of_address_path := OLD.proof_of_address_path;
    NEW.proof_of_address_type := OLD.proof_of_address_type;
    NEW.proof_of_address_issued_on := OLD.proof_of_address_issued_on;
  END IF;
  IF OLD.age_verification_status = 'verified' THEN
    NEW.date_of_birth := OLD.date_of_birth;
    NEW.proof_of_age_path := OLD.proof_of_age_path;
    NEW.proof_of_age_type := OLD.proof_of_age_type;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE POLICY "Users can upload own kyc documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'kyc-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users and admins can read kyc documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'kyc-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR private.has_role(auth.uid(), 'admin'::public.app_role)
    )
  );

CREATE POLICY "Users and admins can delete kyc documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'kyc-documents' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR private.has_role(auth.uid(), 'admin'::public.app_role)
    )
  );

CREATE POLICY "Admins can update kyc documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'kyc-documents' AND private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'kyc-documents' AND private.has_role(auth.uid(), 'admin'::public.app_role));
