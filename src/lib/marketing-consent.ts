export const marketingConsentKey = "soulmate-marketing-consent-v4";
export const marketingConsentLifetime = 180 * 86400000;
export const redditPixelId = "a2_joskcj21ome3";

export function readMarketingConsent(raw: string | null, now = Date.now()): boolean | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (typeof value?.allowed !== "boolean" || !Number.isSafeInteger(value?.savedAt)
      || value.savedAt > now || now - value.savedAt >= marketingConsentLifetime) return null;
    return value.allowed;
  } catch { return null; }
}

export function writeMarketingConsent(allowed: boolean, now = Date.now()) {
  return JSON.stringify({ allowed, savedAt: now });
}