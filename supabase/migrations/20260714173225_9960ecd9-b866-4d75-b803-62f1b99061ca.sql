
CREATE TABLE public.approval_tokens (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique,
  action text not null check (action in ('approve','reject')),
  expires_at timestamptz not null default (now() + interval '14 days'),
  used_at timestamptz,
  created_at timestamptz not null default now()
);

GRANT ALL ON public.approval_tokens TO service_role;

ALTER TABLE public.approval_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service role only" ON public.approval_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX approval_tokens_profile_idx ON public.approval_tokens(profile_id);

CREATE OR REPLACE FUNCTION public.create_approval_tokens()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  IF NEW.status = 'pending' THEN
    INSERT INTO public.approval_tokens (profile_id, token, action)
    VALUES
      (NEW.id, encode(gen_random_bytes(24), 'hex'), 'approve'),
      (NEW.id, encode(gen_random_bytes(24), 'hex'), 'reject');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_approval_tokens_trg ON public.profiles;
CREATE TRIGGER create_approval_tokens_trg
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.create_approval_tokens();
