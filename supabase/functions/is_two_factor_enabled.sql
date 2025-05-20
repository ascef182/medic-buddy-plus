
-- Function to check if two-factor authentication is enabled for the current user
CREATE OR REPLACE FUNCTION public.is_two_factor_enabled()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_enabled boolean;
BEGIN
  SELECT two_factor_enabled INTO is_enabled
  FROM public.user_settings
  WHERE user_id = auth.uid();
  
  -- If no settings record exists, return false
  RETURN COALESCE(is_enabled, false);
END;
$$;

-- Function to set two-factor authentication status for the current user
CREATE OR REPLACE FUNCTION public.set_two_factor_enabled(enabled boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update the user_settings record
  INSERT INTO public.user_settings (user_id, two_factor_enabled)
  VALUES (auth.uid(), enabled)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    two_factor_enabled = enabled,
    updated_at = now();
  
  RETURN true;
END;
$$;
