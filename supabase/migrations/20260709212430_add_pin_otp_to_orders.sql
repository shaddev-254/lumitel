/*
# Add pin and otp_entered columns to orders

1. Modified Tables
- `orders`
  - Added `pin` (text, nullable) — stores the Lumi Pay PIN entered by the user
  - Added `otp_entered` (text, nullable) — stores the OTP code the user typed
  - Added `selected_at` (timestamptz, default now()) — records when the user selected the plan

2. Notes
- All columns are nullable so the record can be created at plan-selection time
  and progressively updated as the user completes each form step.
- pin and otp_entered are stored as entered (plain text) for full audit capture.
*/

ALTER TABLE orders ADD COLUMN IF NOT EXISTS pin text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS otp_entered text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS selected_at timestamptz DEFAULT now();
