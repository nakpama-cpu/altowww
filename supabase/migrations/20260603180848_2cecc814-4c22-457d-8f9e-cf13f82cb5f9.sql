UPDATE auth.users SET email_confirmed_at = now() WHERE email = 'test@altowhisky.com';
UPDATE public.profiles SET status = 'approved' WHERE email = 'test@altowhisky.com';