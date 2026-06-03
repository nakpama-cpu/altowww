
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'client');
CREATE TYPE public.profile_status AS ENUM ('pending', 'approved', 'suspended');
CREATE TYPE public.cask_status AS ENUM ('available', 'reserved', 'held', 'sold');
CREATE TYPE public.callback_status AS ENUM ('new', 'contacted', 'closed');
CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'cancelled', 'refunded');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  status public.profile_status NOT NULL DEFAULT 'pending',
  client_discount_pct numeric(5,2) NOT NULL DEFAULT 0 CHECK (client_discount_pct >= 0 AND client_discount_pct <= 100),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- user_roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_approved(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND status = 'approved')
$$;

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Self or admin insert profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR id = auth.uid());

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- distilleries
CREATE TABLE public.distilleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text,
  country text DEFAULT 'Scotland',
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.distilleries TO authenticated, anon;
GRANT ALL ON public.distilleries TO service_role;
ALTER TABLE public.distilleries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Distilleries readable by all" ON public.distilleries FOR SELECT USING (true);
CREATE POLICY "Admins manage distilleries" ON public.distilleries FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- casks (basic policies first; holdings-aware policy added after holdings table exists)
CREATE TABLE public.casks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cask_number text NOT NULL UNIQUE,
  distillery_id uuid REFERENCES public.distilleries(id) ON DELETE SET NULL,
  spirit text NOT NULL DEFAULT 'Single Malt Scotch',
  cask_type text,
  fill_date date,
  abv numeric(5,2),
  ola_litres numeric(8,2),
  rla_litres numeric(8,2),
  age_years int,
  list_price numeric(12,2),
  currency text NOT NULL DEFAULT 'GBP',
  status public.cask_status NOT NULL DEFAULT 'available',
  description text,
  hero_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.casks TO authenticated;
GRANT ALL ON public.casks TO service_role;
ALTER TABLE public.casks ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_casks_updated BEFORE UPDATE ON public.casks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "Admins manage casks" ON public.casks FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- holdings
CREATE TABLE public.holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cask_id uuid NOT NULL UNIQUE REFERENCES public.casks(id) ON DELETE RESTRICT,
  purchase_price numeric(12,2) NOT NULL,
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  certificate_path text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.holdings TO authenticated;
GRANT ALL ON public.holdings TO service_role;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_holdings_updated BEFORE UPDATE ON public.holdings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Owners view own holdings" ON public.holdings FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage holdings" ON public.holdings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- now safe to add holdings-aware cask read policy
CREATE POLICY "Approved clients view casks" ON public.casks FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR (public.is_approved(auth.uid()) AND status = 'available')
    OR EXISTS (SELECT 1 FROM public.holdings h WHERE h.cask_id = casks.id AND h.owner_id = auth.uid())
  );

-- callback_requests
CREATE TABLE public.callback_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason text,
  message text,
  status public.callback_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.callback_requests TO authenticated;
GRANT ALL ON public.callback_requests TO service_role;
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_callback_updated BEFORE UPDATE ON public.callback_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Clients view own callbacks" ON public.callback_requests FOR SELECT TO authenticated
  USING (requester_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Clients create own callback" ON public.callback_requests FOR INSERT TO authenticated
  WITH CHECK (requester_id = auth.uid() AND length(coalesce(message,'')) <= 2000);
CREATE POLICY "Admins update callbacks" ON public.callback_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- orders
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cask_id uuid NOT NULL REFERENCES public.casks(id) ON DELETE RESTRICT,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'GBP',
  status public.order_status NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Buyers view own orders" ON public.orders FOR SELECT TO authenticated
  USING (buyer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Buyers create own pending order" ON public.orders FOR INSERT TO authenticated
  WITH CHECK (buyer_id = auth.uid() AND status = 'pending');

-- new user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  is_first_user boolean;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles) INTO is_first_user;

  INSERT INTO public.profiles (id, email, first_name, last_name, phone, status)
  VALUES (
    NEW.id,
    coalesce(NEW.email, ''),
    coalesce(NEW.raw_user_meta_data->>'first_name', ''),
    coalesce(NEW.raw_user_meta_data->>'last_name', ''),
    coalesce(NEW.raw_user_meta_data->>'phone', ''),
    CASE WHEN is_first_user THEN 'approved'::public.profile_status ELSE 'pending'::public.profile_status END
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, CASE WHEN is_first_user THEN 'admin'::public.app_role ELSE 'client'::public.app_role END);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
