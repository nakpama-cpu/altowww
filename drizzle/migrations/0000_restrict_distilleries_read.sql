DROP POLICY IF EXISTS "Distilleries readable by all" ON public.distilleries;
CREATE POLICY "Distilleries readable by signed-in users" ON public.distilleries FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
REVOKE SELECT ON public.distilleries FROM anon;