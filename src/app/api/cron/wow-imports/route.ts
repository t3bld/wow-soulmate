import { NextRequest, NextResponse } from "next/server";
import { purgeExpiredWowImports } from "@/lib/profile-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse(null, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  await purgeExpiredWowImports();
  return new NextResponse(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}