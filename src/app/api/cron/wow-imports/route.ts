import { NextRequest, NextResponse } from "next/server";
import { database, purgeExpiredFeedbackLimits, purgeExpiredWowImports } from "@/lib/profile-store";
import { validCronAuthorization } from "@/lib/auth-security";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!validCronAuthorization(request.headers.get("authorization"), secret)) {
    return new NextResponse(null, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  await purgeExpiredWowImports();
  await purgeExpiredFeedbackLimits();
  await database().session.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  await database().verification.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  await database().requestRateLimit.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  await database().rateLimit.deleteMany({ where: { lastRequest: { lt: BigInt(Date.now() - 86400000) } } });
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}