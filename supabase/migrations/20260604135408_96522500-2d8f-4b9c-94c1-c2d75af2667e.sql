UPDATE public.distilleries SET image_url = CASE region
  WHEN 'Islay' THEN '/distillery-islay.jpg'
  WHEN 'Speyside' THEN '/distillery-speyside.jpg'
  WHEN 'Lowland' THEN '/distillery-lowland.jpg'
  ELSE '/distillery-highland.jpg'
END
WHERE image_url IS NULL OR image_url = '';