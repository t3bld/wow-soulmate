import "server-only";
import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { createRedditReceipt, redditEventCookie, redditEventLifetime, type RedditEvent } from "./reddit-events";
import { sendRedditConversion } from "./reddit-conversions";
import { sendMetaConversion } from "./meta-conversions";

export function queueMetaConversion(event: RedditEvent, receipt: string, cookieHeader: string, path: string, userAgent: string) {
  const token = process.env.META_CONVERSION_API_SECRET;
  const origin = process.env.APP_URL;
  if (!token || !origin) return;
  const testCode = process.env.META_CAPI_TEST_EVENT_CODE;
  try {
    after(async () => {
      const result = await sendMetaConversion(event, receipt, cookieHeader, { origin, path, userAgent }, token, testCode);
      if (result === "failed") console.error("Optional Meta conversion delivery failed", { event });
    });
  } catch {
    console.error("Could not schedule optional Meta conversion");
  }
}

export function queueRedditConversion(event: RedditEvent, receipt: string, cookieHeader: string) {
  const token = process.env.REDDIT_CONVERSION_API_SECRET;
  if (!token) return;
  const testId = process.env.REDDIT_CAPI_TEST_ID;
  try {
    after(async () => {
      const result = await sendRedditConversion(event, receipt, cookieHeader, token, testId);
      if (result === "failed") console.error("Optional Reddit conversion delivery failed", { event });
    });
  } catch {
    console.error("Could not schedule optional Reddit conversion");
  }
}

export async function recordRedditEvent(event: RedditEvent, path: string) {
  try {
    const jar = await cookies();
    const cookieHeader = jar.toString();
    const receipt = createRedditReceipt(cookieHeader);
    if (receipt) {
      jar.set(redditEventCookie(event), receipt, {
        path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: redditEventLifetime,
      });
      queueRedditConversion(event, receipt, cookieHeader);
      queueMetaConversion(event, receipt, cookieHeader, path, (await headers()).get("user-agent") ?? "");
    }
  } catch {
    console.error("Could not prepare optional conversion event");
  }
}