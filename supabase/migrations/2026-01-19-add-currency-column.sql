-- Migration: Add currency column to orders table
-- Date: 2026-01-19
-- Description: Add currency column to track EUR/FCFA

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'EUR';

-- Create an index for faster queries by currency
CREATE INDEX IF NOT EXISTS idx_orders_currency ON public.orders (currency);
