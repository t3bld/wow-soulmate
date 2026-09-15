import { isLocale } from "../i18n/config";
import { cookieValue, hasMarketingConsent, metaConversionCommand, metaPixelId, type RedditEvent } from "./reddit-events";

export type MetaConversionContext = { origin: string; path: string; userAgent: string };

export function metaConversionPayload(event: RedditEvent, receipt: string, cookieHeader: string, context: MetaConversionContext, now = Date.now()) {
  if (!hasMarketingConsent(cookieHeader)) return null;
  const command = metaConversionCommand(event, receipt, now);
  if (!command || (command[0] !== "track" && command[0] !== "trackCustom") || command.length !== 4) return null;
  const userAgent = context.userAgent.trim();
  if (!userAgent || userAgent.length > 2048 || /[\r\n]/.test(userAgent)) return null;
  let source: URL;
  try {
    const origin = new URL(context.origin);
    if (origin.username || origin.password || origin.search || origin.hash || origin.pathname !== "/") return null;
    if (origin.protocol !== "https:" && !(origin.protocol === "http:" && ["localhost", "127.0.0.1"].includes(origin.hostname))) return null;
    source = new URL(context.path, origin);
    const segments = source.pathname.split("/");
    const expectedPage = event === "SignUp" ? "profile" : "addon";
    if (source.origin !== origin.origin || source.username || source.password) return null;
    if (event === "BnetLoginCompleted" ? source.pathname !== "/oauth/redirect" : segments.length !== 3 || !isLocale(segments[1]) || segments[2] !== expectedPage) return null;
    source.search = "";
    source.hash = "";
  } catch { return null; }
  const browserId = cookieValue(cookieHeader, "_fbp");
  const clickId = cookieValue(cookieHeader, "_fbc");
  const fbp = browserId && /^fb\.\d{1,2}\.\d{13}\.\d{1,30}$/.test(browserId) ? browserId : undefined;
  const fbc = clickId && /^fb\.\d{1,2}\.\d{13}\.[A-Za-z0-9_-]{1,500}$/.test(clickId) ? clickId : undefined;
  if (!fbp && !fbc) return null;
  const { createdAt } = JSON.parse(receipt) as { createdAt: number };
  return { data: [{
    event_name: command[1], event_time: Math.floor(createdAt / 1000), event_id: command[3].eventID,
    action_source: "website", event_source_url: source.toString(),
    user_data: { client_user_agent: userAgent, ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}) },
  }] };
}

export async function sendMetaConversion(event: RedditEvent, receipt: string, cookieHeader: string, context: MetaConversionContext, token: string | undefined, testCode?: string, request: typeof fetch = fetch) {
  if (!token || !token.trim() || /\s/.test(token)) return "disabled";
  const payload = metaConversionPayload(event, receipt, cookieHeader, context);
  if (!payload) return "skipped";
  const body = JSON.stringify({ ...payload, ...(testCode ? { test_event_code: testCode } : {}) });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await request(`https://graph.facebook.com/v26.0/${metaPixelId}/events`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(4000),
      });
      if (response.status === 200) {
        const result: unknown = await response.json();
        return result && typeof result === "object" && !("error" in result) && "events_received" in result && result.events_received === 1 ? "accepted" : "failed";
      }
      await response.body?.cancel();
      if (response.status < 500 || attempt === 1) return "failed";
    } catch {
      if (attempt === 1) return "failed";
    }
  }
  return "failed";
}