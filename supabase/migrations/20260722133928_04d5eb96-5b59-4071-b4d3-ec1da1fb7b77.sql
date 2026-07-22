
ALTER TABLE public.casks
  ADD COLUMN IF NOT EXISTS wood text,
  ADD COLUMN IF NOT EXISTS cask_size_litres numeric(6,1);

ALTER TABLE public.cask_listings
  ADD COLUMN IF NOT EXISTS wood text,
  ADD COLUMN IF NOT EXISTS cask_size_litres numeric(6,1);

-- Backfill cask_listings
UPDATE public.cask_listings SET
  wood = COALESCE(wood, NULLIF(TRIM(regexp_replace(cask_type, '\s*(Barrel|Hogshead|Butt|Puncheon)\s*$', '', 'i')), '')),
  cask_size_litres = COALESCE(cask_size_litres, CASE
    WHEN cask_type ILIKE '%Butt%' THEN 500
    WHEN cask_type ILIKE '%Puncheon%' THEN 450
    WHEN cask_type ILIKE '%Hogshead%' THEN 250
    WHEN cask_type ILIKE '%Barrel%' THEN 200
    ELSE NULL
  END),
  cask_type = CASE
    WHEN cask_type ILIKE '%Butt%' THEN 'Butt'
    WHEN cask_type ILIKE '%Puncheon%' THEN 'Puncheon'
    WHEN cask_type ILIKE '%Hogshead%' THEN 'Hogshead'
    WHEN cask_type ILIKE '%Barrel%' THEN 'Barrel'
    ELSE cask_type
  END
WHERE cask_type IS NOT NULL;

-- Backfill casks
UPDATE public.casks SET
  wood = COALESCE(wood, NULLIF(TRIM(regexp_replace(cask_type, '\s*(Barrel|Hogshead|Butt|Puncheon)\s*$', '', 'i')), '')),
  cask_size_litres = COALESCE(cask_size_litres, CASE
    WHEN cask_type ILIKE '%Butt%' THEN 500
    WHEN cask_type ILIKE '%Puncheon%' THEN 450
    WHEN cask_type ILIKE '%Hogshead%' THEN 250
    WHEN cask_type ILIKE '%Barrel%' THEN 200
    ELSE NULL
  END),
  cask_type = CASE
    WHEN cask_type ILIKE '%Butt%' THEN 'Butt'
    WHEN cask_type ILIKE '%Puncheon%' THEN 'Puncheon'
    WHEN cask_type ILIKE '%Hogshead%' THEN 'Hogshead'
    WHEN cask_type ILIKE '%Barrel%' THEN 'Barrel'
    ELSE cask_type
  END
WHERE cask_type IS NOT NULL;
