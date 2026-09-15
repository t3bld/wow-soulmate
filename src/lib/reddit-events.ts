import { marketingConsentKey, readMarketingConsent } from "./marketing-consent";

export const redditEvents = ["BnetLoginCompleted", "SignUp", "AddonFeedbackSubmitted"] as const;
export type RedditEvent = typeof redditEvents[number];
export type RedditCommand = ["init", string] | ["track", "PageVisit"]
  | ["track", "SignUp", { conversionId: string }]
  | ["track", "Custom", { customEventName: Exclude<RedditEvent, "SignUp">; conversionId: string }];
export const redditEventLifetime = 300;
export const redditEventSignal = "soulmate-reddit-success";
export const metaPixelId = "1104846879163162";
export type MetaCommand = ["init", string] | ["track", "PageView"]
  | ["set", "autoConfig", boolean, string] | ["consent", "revoke" | "grant"]
  | ["track", "CompleteRegistration", Record<string, never>, { eventID: string }]
  | ["trackCustom", "BnetLoginCompleted" | "AddonFeedbackSubmitted", Record<string, never>, { eventID: string }];

export function metaConversionCommand(event: RedditEvent, raw: string | null, now = Date.now()): MetaCommand | null {
  const command = conversionCommand(event, raw, now);
  if (!command || command[0] !== "track" || command.length !== 3) return null;
  const options = { eventID: command[2].conversionId };
  return event === "SignUp" ? ["track", "CompleteRegistration", {}, options] : ["trackCustom", event, {}, options];
}

export function cookieValue(header: string, name: string) {
  const value = header.split(";").map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1);
  try { return value ? decodeURIComponent(value) : null; } catch { return null; }
}

export function hasMarketingConsent(header: string) {
  return cookieValue(header, "soulmate-marketing-disabled") !== "1"
    && readMarketingConsent(cookieValue(header, marketingConsentKey)) === true;
}

export function redditEventCookie(event: RedditEvent) {
  return `soulmate-reddit-${event}`;
}

export function createRedditReceipt(cookieHeader: string) {
  return hasMarketingConsent(cookieHeader) ? JSON.stringify({ conversionId: crypto.randomUUID(), createdAt: Date.now() }) : null;
}

export function conversionCommand(event: RedditEvent, raw: string | null, now = Date.now()): RedditCommand | null {
  if (!raw) return null;
  try {
    const { conversionId, createdAt } = JSON.parse(raw);
    if (!redditEvents.includes(event) || typeof conversionId !== "string" || !/^[a-f0-9-]{36}$/.test(conversionId)
      || !Number.isSafeInteger(createdAt) || createdAt > now || now - createdAt >= redditEventLifetime * 1000) return null;
    return event === "SignUp" ? ["track", "SignUp", { conversionId }]
      : ["track", "Custom", { customEventName: event, conversionId }];
  } catch { return null; }
}