import "server-only";
import { cookies } from "next/headers";
import { after } from "next/server";
import { createRedditReceipt, redditEventCookie, redditEventLifetime, type RedditEvent } from "./reddit-events";
import { sendRedditConversion } from "./reddit-conversions";

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

export async function recordRedditEvent(event: RedditEvent) {
  try {
    const jar = await cookies();
    const cookieHeader = jar.toString();
    const receipt = createRedditReceipt(cookieHeader);
    if (receipt) {
      jar.set(redditEventCookie(event), receipt, {
        path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: redditEventLifetime,
      });
      queueRedditConversion(event, receipt, cookieHeader);
    }
  } catch {
    console.error("Could not prepare optional conversion event");
  }
}