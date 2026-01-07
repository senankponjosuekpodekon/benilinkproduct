-- Migration: orders table for BeniLink
-- Date: 2026-01-07
-- Description: Stores orders with delivery info, items, and pricing in FCFA/EUR.

create schema if not exists public;

create table if not exists public.orders (
  order_id text primary key,
  created_at timestamptz not null default now(),
  subtotal_fcfa integer not null,
  shipping_fcfa integer not null,
  tax_fcfa integer not null,
  total_fcfa integer not null,
  amount_eur numeric(12,2),
  payment_method text,
  delivery_info jsonb not null,
  items jsonb not null,
  metadata jsonb,
  status text default 'pending',
  constraint subtotal_non_negative check (subtotal_fcfa >= 0),
  constraint shipping_non_negative check (shipping_fcfa >= 0),
  constraint tax_non_negative check (tax_fcfa >= 0),
  constraint total_non_negative check (total_fcfa >= 0)
);

-- Indexes for faster admin/dashboard queries
create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_country on public.orders ((delivery_info->>'country'));
create index if not exists idx_orders_payment_method on public.orders (payment_method);

-- Suggested RLS (enable if you plan to expose via client-side queries)
-- alter table public.orders enable row level security;
-- create policy "Allow service role only" on public.orders
--   for all using (auth.role() = 'service_role');
