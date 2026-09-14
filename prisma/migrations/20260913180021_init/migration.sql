-- CreateTable
CREATE TABLE "soulmate_profiles" (
    "id" UUID NOT NULL,
    "subject" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "activities" TEXT[],
    "experience" TEXT NOT NULL,
    "age_group" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,
    "days" INTEGER[],
    "start_hour" INTEGER NOT NULL,
    "end_hour" INTEGER NOT NULL,
    "adult" BOOLEAN NOT NULL,
    "discoverable" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "soulmate_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "soulmate_profiles_subject_key" ON "soulmate_profiles"("subject");

-- CreateIndex
CREATE INDEX "soulmate_profiles_discoverable_region_language_idx" ON "soulmate_profiles"("discoverable", "region", "language");
