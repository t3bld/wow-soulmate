import "server-only";
import { cookies } from "next/headers";
import { createRedditReceipt, redditEventCookie, redditEventLifetime, type RedditEvent } from "./reddit-events";

export async function recordRedditEvent(event: RedditEvent) {
  try {
    const jar = await cookies();
    const receipt = createRedditReceipt(jar.toString());
    if (receipt) jar.set(redditEventCookie(event), receipt, {
      path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: redditEventLifetime,
    });
  } catch {
    console.error("Could not prepare optional conversion event");
  }
}