CREATE TABLE "soulmate_wow_imports" (
    "subject" TEXT NOT NULL,
    "run_id" UUID NOT NULL,
    "profile_id" UUID,
    "snapshot" JSONB NOT NULL,
    "started_at" TIMESTAMPTZ(3) NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    CONSTRAINT "soulmate_wow_imports_pkey" PRIMARY KEY ("subject")
);

CREATE UNIQUE INDEX "soulmate_wow_imports_profile_id_key" ON "soulmate_wow_imports"("profile_id");
CREATE INDEX "soulmate_wow_imports_expires_at_idx" ON "soulmate_wow_imports"("expires_at");
ALTER TABLE "soulmate_wow_imports" ADD CONSTRAINT "soulmate_wow_imports_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "soulmate_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;