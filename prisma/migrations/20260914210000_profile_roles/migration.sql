ALTER TABLE "soulmate_profiles" ADD COLUMN "roles" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
UPDATE "soulmate_profiles" SET "roles" = ARRAY["role"];