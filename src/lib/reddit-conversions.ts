import { redditPixelId } from "./marketing-consent";
import { conversionCommand, cookieValue, hasMarketingConsent, type RedditEvent } from "./reddit-events";

export function redditConversionPayload(event: RedditEvent, receipt: string, cookieHeader: string, now = Date.now()) {
  if (!hasMarketingConsent(cookieHeader)) return null;
  const command = conversionCommand(event, receipt, now);
  if (!command || command.length !== 3) return null;
  const { createdAt } = JSON.parse(receipt) as { createdAt: number };
  const clickId = cookieValue(cookieHeader, "_rdt_cid");
  const uuid = cookieValue(cookieHeader, "_rdt_uuid");
  return { data: { events: [{
    event_at: createdAt,
    action_source: "WEBSITE",
    type: event === "SignUp" ? { tracking_type: "SIGN_UP" } : { tracking_type: "CUSTOM", custom_event_name: event },
    metadata: { conversion_id: command[2].conversionId },
    ...(clickId && /^[A-Za-z0-9_-]{1,256}$/.test(clickId) ? { click_id: clickId } : {}),
    ...(uuid && /^(?:\d{10,16}\.)?[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(uuid) ? { user: { uuid } } : {}),
  }] } };
}

export async function sendRedditConversion(event: RedditEvent, receipt: string, cookieHeader: string, token: string | undefined, testId?: string, request: typeof fetch = fetch) {
  if (!token || !token.trim() || /\s/.test(token)) return "disabled";
  const payload = redditConversionPayload(event, receipt, cookieHeader);
  if (!payload) return "skipped";
  const body = JSON.stringify({ data: { ...payload.data, ...(testId ? { test_id: testId } : {}) } });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await request(`https://ads-api.reddit.com/api/v3/pixels/${redditPixelId}/conversion_events`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(4000),
      });
      if (response.status === 200) {
        const result: unknown = await response.json();
        return result && typeof result === "object" && "data" in result && result.data && typeof result.data === "object"
          && "message" in result.data && typeof result.data.message === "string" ? "accepted" : "failed";
      }
      await response.body?.cancel();
      if (response.status < 500 || attempt === 1) return "failed";
    } catch {
      if (attempt === 1) return "failed";
    }
  }
  return "failed";
}