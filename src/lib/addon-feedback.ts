import { createHash } from "node:crypto";
import { z } from "zod";
import { operator } from "../i18n/legal";

export const addonFeedbackSchema = z.object({
  email: z.email().max(254),
  message: z.string().trim().min(10).max(4000),
});

export async function deliverAddonFeedback(
  input: z.infer<typeof addonFeedbackSchema>,
  options: { apiKey: string; from: string; subject: string; now?: number },
  request: typeof fetch = fetch,
): Promise<"sent" | "limited" | "failed"> {
  const parsed = addonFeedbackSchema.safeParse(input);
  if (!parsed.success || !options.apiKey || !options.from) return "failed";
  const bucket = Math.floor((options.now ?? Date.now()) / 300_000);
  const key = createHash("sha256").update(`addon:${options.subject}:${bucket}`).digest("hex");
  try {
    const response = await request("https://api.resend.com/emails", {
      method: "POST",
      cache: "no-store",
      redirect: "error",
      headers: { Authorization: `Bearer ${options.apiKey}`, "Content-Type": "application/json", "Idempotency-Key": key },
      body: JSON.stringify({
        from: options.from,
        to: [operator.email],
        reply_to: parsed.data.email,
        subject: "WoW Soulmate: Addon-Feedback",
        text: `Antwortadresse: ${parsed.data.email}\n\n${parsed.data.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status === 409 || response.status === 429) return "limited";
    if (!response.ok) return "failed";
    const result: unknown = await response.json();
    return result && typeof result === "object" && "id" in result && typeof result.id === "string" && result.id ? "sent" : "failed";
  } catch { return "failed"; }
}