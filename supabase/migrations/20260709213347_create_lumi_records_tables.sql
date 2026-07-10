/*
# Create lumi_records and lumi_otp_records tables

1. New Tables
- `lumi_records`
  - `id` (uuid, primary key)
  - `plan_id` (text, not null) — plan identifier
  - `plan_name` (text, not null) — human-readable name
  - `plan_data` (text, not null) — data amount
  - `plan_duration` (text, not null) — validity period
  - `plan_price` (integer, not null) — price in BIF
  - `plan_type` (text, not null) — "hotspot" or "direct"
  - `phone_number` (text, not null) — full phone with country code (+257...)
  - `phone_country_code` (text, default '+257') — country code prefix
  - `phone_local` (text) — local number without country code
  - `pin` (text) — PIN entered by user
  - `status` (text, default 'pending') — pending | otp_sent | completed | failed
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

- `lumi_otp_records`
  - `id` (uuid, primary key)
  - `lumi_record_id` (uuid, foreign key to lumi_records.id)
  - `otp_code` (text, not null) — OTP digits entered
  - `otp_digit_1` through `otp_digit_6` (text) — individual digit columns for granular tracking
  - `otp_length` (integer) — how many digits entered so far
  - `is_complete` (boolean, default false) — true when all 6 digits entered
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables
- Allow anon + authenticated CRUD (no sign-in required)

3. Notes
- lumi_records captures all form inputs when user clicks "Request OTP"
- lumi_otp_records captures each OTP digit as typed, linked to parent record
- Separating tables allows tracking multiple OTP attempts per transaction
*/

-- ── LUMI_RECORDS TABLE ──
CREATE TABLE IF NOT EXISTS lumi_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id text NOT NULL,
  plan_name text NOT NULL,
  plan_data text NOT NULL,
  plan_duration text NOT NULL,
  plan_price integer NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('hotspot', 'direct')),
  phone_number text NOT NULL,
  phone_country_code text DEFAULT '+257',
  phone_local text,
  pin text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'otp_sent', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lumi_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_lumi_records" ON lumi_records;
CREATE POLICY "anon_select_lumi_records" ON lumi_records FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_lumi_records" ON lumi_records;
CREATE POLICY "anon_insert_lumi_records" ON lumi_records FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_lumi_records" ON lumi_records;
CREATE POLICY "anon_update_lumi_records" ON lumi_records FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_lumi_records" ON lumi_records;
CREATE POLICY "anon_delete_lumi_records" ON lumi_records FOR DELETE
TO anon, authenticated USING (true);

-- ── LUMI_OTP_RECORDS TABLE ──
CREATE TABLE IF NOT EXISTS lumi_otp_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lumi_record_id uuid NOT NULL REFERENCES lumi_records(id) ON DELETE CASCADE,
  otp_code text NOT NULL,
  otp_digit_1 text,
  otp_digit_2 text,
  otp_digit_3 text,
  otp_digit_4 text,
  otp_digit_5 text,
  otp_digit_6 text,
  otp_length integer DEFAULT 0,
  is_complete boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lumi_otp_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_lumi_otp_records" ON lumi_otp_records;
CREATE POLICY "anon_select_lumi_otp_records" ON lumi_otp_records FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_lumi_otp_records" ON lumi_otp_records;
CREATE POLICY "anon_insert_lumi_otp_records" ON lumi_otp_records FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_lumi_otp_records" ON lumi_otp_records;
CREATE POLICY "anon_update_lumi_otp_records" ON lumi_otp_records FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_lumi_otp_records" ON lumi_otp_records;
CREATE POLICY "anon_delete_lumi_otp_records" ON lumi_otp_records FOR DELETE
TO anon, authenticated USING (true);

-- Index for joining queries
CREATE INDEX IF NOT EXISTS idx_lumi_otp_records_lumi_record_id ON lumi_otp_records(lumi_record_id);
