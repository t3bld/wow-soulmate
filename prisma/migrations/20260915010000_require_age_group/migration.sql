BEGIN;

ALTER TABLE "soulmate_profiles"
  DROP CONSTRAINT "profile_age_valid",
  ADD CONSTRAINT "profile_age_valid"
    CHECK ("age_group" IN ('18-24', '25-34', '35-44', '45+'));

COMMIT;