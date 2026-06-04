UPDATE public.distilleries SET image_url = CASE name
  WHEN 'Glen Mhor' THEN '/distillery-glen-mhor.jpg'
  WHEN 'Caol Ila' THEN '/distillery-caol-ila.jpg'
  WHEN 'Glenrothes' THEN '/distillery-glenrothes.jpg'
  WHEN 'Ben Nevis' THEN '/distillery-ben-nevis.jpg'
  WHEN 'Bunnahabhain' THEN '/distillery-bunnahabhain.jpg'
  WHEN 'Auchentoshan' THEN '/distillery-auchentoshan.jpg'
  WHEN 'Tomatin' THEN '/distillery-tomatin.jpg'
  ELSE image_url
END;