-- Migration: Enable RLS on orders table
-- Date: 2026-01-19
-- Description: Activate Row Level Security to fix security warning

-- Enable RLS on the orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to do all operations (needed for backend API)
CREATE POLICY "Allow service role all operations"
  ON public.orders
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Deny anonymous access
CREATE POLICY "Deny anonymous access"
  ON public.orders
  FOR ALL
  USING (false)
  WITH CHECK (false);
