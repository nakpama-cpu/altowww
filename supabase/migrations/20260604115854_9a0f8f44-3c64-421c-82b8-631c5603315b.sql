
ALTER TABLE public.distilleries
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS founded_by text,
  ADD COLUMN IF NOT EXISTS founded_year integer,
  ADD COLUMN IF NOT EXISTS famous_for text,
  ADD COLUMN IF NOT EXISTS region_character text,
  ADD COLUMN IF NOT EXISTS annual_production text,
  ADD COLUMN IF NOT EXISTS export_markets text,
  ADD COLUMN IF NOT EXISTS owner text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS visitor_centre text,
  ADD COLUMN IF NOT EXISTS news jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.distilleries DROP COLUMN IF EXISTS awards;
ALTER TABLE public.distilleries ADD COLUMN awards jsonb NOT NULL DEFAULT '[]'::jsonb;
