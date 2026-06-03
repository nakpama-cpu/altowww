
-- Explicit admin UPDATE/DELETE for orders; deny others
CREATE POLICY "Admins update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete orders" ON public.orders
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Explicit admin-only DELETE on profiles
CREATE POLICY "Admins delete profiles" ON public.profiles
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Tighten cask-certificates admin upload to enforce {holding_id}/... naming
DROP POLICY IF EXISTS "Admins manage cert files" ON storage.objects;

CREATE POLICY "Admins read cert files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cask-certificates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert cert files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cask-certificates'
    AND public.has_role(auth.uid(), 'admin')
    AND (string_to_array(name, '/'))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    AND EXISTS (SELECT 1 FROM public.holdings h WHERE h.id::text = (string_to_array(name, '/'))[1])
  );

CREATE POLICY "Admins update cert files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cask-certificates' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (
    bucket_id = 'cask-certificates'
    AND public.has_role(auth.uid(), 'admin')
    AND (string_to_array(name, '/'))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    AND EXISTS (SELECT 1 FROM public.holdings h WHERE h.id::text = (string_to_array(name, '/'))[1])
  );

CREATE POLICY "Admins delete cert files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cask-certificates' AND public.has_role(auth.uid(), 'admin'));
