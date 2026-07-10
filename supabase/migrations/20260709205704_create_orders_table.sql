/*
# Create orders table for Starlink Bundle Sales

1. New Tables
- `orders`
  - `id` (uuid, primary key)
  - `plan_id` (text, not null) — identifier for the plan (e.g. "hotspot_10gb")
  - `plan_name` (text, not null) — human-readable plan name
  - `plan_data` (text, not null) — data amount (e.g. "10 GB", "UNLIMITED")
  - `plan_duration` (text, not null) — validity (e.g. "7 Days")
  - `plan_price` (integer, not null) — price in BIF (Burundian Franc)
  - `plan_type` (text, not null) — "hotspot" or "direct"
  - `phone_number` (text, not null) — Lumitel phone number used for payment
  - `status` (text, not null, default "pending") — pending | completed | failed
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `orders`
- Allow anon + authenticated CRUD (no sign-in required for this app)

3. Notes
- Single-tenant: no user_id, no auth.uid() — payment is anonymous
- Status tracks the Lumi Pay OTP flow lifecycle
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id text NOT NULL,
  plan_name text NOT NULL,
  plan_data text NOT NULL,
  plan_duration text NOT NULL,
  plan_price integer NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('hotspot', 'direct')),
  phone_number text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
TO anon, authenticated USING (true);
