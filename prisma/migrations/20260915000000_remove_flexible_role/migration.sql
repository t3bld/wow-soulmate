BEGIN;

UPDATE "soulmate_profiles"
SET "roles" = ARRAY['tank', 'healer', 'damage']::TEXT[]
WHERE 'flexible' = ANY("roles");

ALTER TABLE "soulmate_profiles"
  DROP CONSTRAINT "profile_roles_valid",
  ADD CONSTRAINT "profile_roles_valid"
    CHECK (soulmate_valid_selection("roles", ARRAY['tank', 'healer', 'damage'], 1));

COMMIT;