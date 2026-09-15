ALTER TABLE "soulmate_profiles"
ADD COLUMN "bnet_battle_tag" VARCHAR(128),
ADD COLUMN "bnet_email" VARCHAR(254),
ADD COLUMN "bnet_email_verified" BOOLEAN,
ADD COLUMN "bnet_last_login_at" TIMESTAMPTZ(3);