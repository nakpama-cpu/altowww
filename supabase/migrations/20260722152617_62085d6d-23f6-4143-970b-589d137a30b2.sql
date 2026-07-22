ALTER TABLE public.cask_listings ADD COLUMN IF NOT EXISTS spirit_name text;
ALTER TABLE public.casks ADD COLUMN IF NOT EXISTS spirit_name text;