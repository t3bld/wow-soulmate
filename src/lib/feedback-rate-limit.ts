import { Prisma } from "../generated/prisma/client";

export function feedbackRateLimitQuery(key: string) {
  if (!/^[a-f0-9]{64}$/.test(key)) throw new Error("Invalid rate limit key");
  return Prisma.sql`
    INSERT INTO soulmate_feedback_rate_limits (key, next_allowed_at)
    VALUES (${key}, CURRENT_TIMESTAMP + INTERVAL '5 minutes')
    ON CONFLICT (key) DO UPDATE
    SET next_allowed_at = EXCLUDED.next_allowed_at
    WHERE soulmate_feedback_rate_limits.next_allowed_at <= CURRENT_TIMESTAMP
    RETURNING key
  `;
}