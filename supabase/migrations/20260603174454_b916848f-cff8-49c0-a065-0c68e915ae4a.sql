
-- Certificate files live at path: <holding_id>/<filename>
CREATE POLICY "Admins manage cert files" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'cask-certificates' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'cask-certificates' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Owners download own certs" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'cask-certificates'
    AND EXISTS (
      SELECT 1 FROM public.holdings h
      WHERE h.id::text = (string_to_array(name, '/'))[1]
        AND h.owner_id = auth.uid()
    )
  );
