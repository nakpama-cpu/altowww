
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION private.is_approved(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND status = 'approved')
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_approved(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_approved(uuid) TO authenticated, service_role;

-- profiles
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT
USING ((id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE
USING ((id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK ((id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Self or admin insert profile" ON public.profiles;
CREATE POLICY "Self or admin insert profile" ON public.profiles FOR INSERT
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) OR (id = auth.uid()));

DROP POLICY IF EXISTS "Admins delete profiles" ON public.profiles;
CREATE POLICY "Admins delete profiles" ON public.profiles FOR DELETE
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- user_roles
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT
USING ((user_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

-- distilleries
DROP POLICY IF EXISTS "Admins manage distilleries" ON public.distilleries;
CREATE POLICY "Admins manage distilleries" ON public.distilleries FOR ALL
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- casks
DROP POLICY IF EXISTS "Admins manage casks" ON public.casks;
CREATE POLICY "Admins manage casks" ON public.casks FOR ALL
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Approved clients view casks" ON public.casks;
CREATE POLICY "Approved clients view casks" ON public.casks FOR SELECT
USING (
  private.has_role(auth.uid(), 'admin'::public.app_role)
  OR (private.is_approved(auth.uid()) AND (status = 'available'::public.cask_status))
  OR EXISTS (SELECT 1 FROM public.holdings h WHERE h.cask_id = casks.id AND h.owner_id = auth.uid())
);

-- holdings
DROP POLICY IF EXISTS "Owners view own holdings" ON public.holdings;
CREATE POLICY "Owners view own holdings" ON public.holdings FOR SELECT
USING ((owner_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage holdings" ON public.holdings;
CREATE POLICY "Admins manage holdings" ON public.holdings FOR ALL
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- callback_requests
DROP POLICY IF EXISTS "Clients view own callbacks" ON public.callback_requests;
CREATE POLICY "Clients view own callbacks" ON public.callback_requests FOR SELECT
USING ((requester_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins update callbacks" ON public.callback_requests;
CREATE POLICY "Admins update callbacks" ON public.callback_requests FOR UPDATE
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- orders
DROP POLICY IF EXISTS "Buyers view own orders" ON public.orders;
CREATE POLICY "Buyers view own orders" ON public.orders FOR SELECT
USING ((buyer_id = auth.uid()) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins update orders" ON public.orders;
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins delete orders" ON public.orders;
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE
USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- storage.objects (cert files)
DROP POLICY IF EXISTS "Admins read cert files" ON storage.objects;
CREATE POLICY "Admins read cert files" ON storage.objects FOR SELECT
USING ((bucket_id = 'cask-certificates') AND private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins insert cert files" ON storage.objects;
CREATE POLICY "Admins insert cert files" ON storage.objects FOR INSERT
WITH CHECK (
  (bucket_id = 'cask-certificates')
  AND private.has_role(auth.uid(), 'admin'::public.app_role)
  AND ((string_to_array(name, '/'))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
  AND EXISTS (SELECT 1 FROM public.holdings h WHERE (h.id)::text = (string_to_array(objects.name, '/'))[1])
);

DROP POLICY IF EXISTS "Admins update cert files" ON storage.objects;
CREATE POLICY "Admins update cert files" ON storage.objects FOR UPDATE
USING ((bucket_id = 'cask-certificates') AND private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (
  (bucket_id = 'cask-certificates')
  AND private.has_role(auth.uid(), 'admin'::public.app_role)
  AND ((string_to_array(name, '/'))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$')
  AND EXISTS (SELECT 1 FROM public.holdings h WHERE (h.id)::text = (string_to_array(objects.name, '/'))[1])
);

DROP POLICY IF EXISTS "Admins delete cert files" ON storage.objects;
CREATE POLICY "Admins delete cert files" ON storage.objects FOR DELETE
USING ((bucket_id = 'cask-certificates') AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- Now drop public versions
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_approved(uuid);
