CREATE TABLE "soulmate_feedback_rate_limits" (
    "key" VARCHAR(64) NOT NULL PRIMARY KEY,
    "next_allowed_at" TIMESTAMPTZ(3) NOT NULL
);

CREATE INDEX "soulmate_feedback_rate_limits_next_allowed_at_idx"
ON "soulmate_feedback_rate_limits" ("next_allowed_at");