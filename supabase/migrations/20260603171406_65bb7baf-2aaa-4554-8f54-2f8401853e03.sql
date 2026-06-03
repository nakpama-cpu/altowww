-- Replace overly permissive INSERT policy with one that validates input
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;

CREATE POLICY "Anyone can submit a valid lead"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(first_name)) BETWEEN 1 AND 100
  AND length(btrim(last_name)) BETWEEN 1 AND 100
  AND length(btrim(email)) BETWEEN 3 AND 320
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(phone)) BETWEEN 3 AND 40
  AND (message IS NULL OR length(message) <= 2000)
  AND (source IS NULL OR length(source) <= 100)
);

-- Explicit restrictive policies: no client-side reads, updates, or deletes.
-- Service role bypasses RLS and remains able to manage leads from trusted backends.
CREATE POLICY "No client reads of leads"
ON public.leads
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "No client updates of leads"
ON public.leads
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "No client deletes of leads"
ON public.leads
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);
