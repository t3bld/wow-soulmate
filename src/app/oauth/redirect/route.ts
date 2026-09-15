import { NextRequest } from "next/server";
import { authSettings } from "@/lib/auth";
import { handleAuth } from "@/lib/auth-handler";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  try {
    const destination = new URL("/api/auth/callback/battlenet", authSettings().origin);
    destination.search = request.nextUrl.search;
    return await handleAuth(new Request(destination, { headers: request.headers }));
  } catch {
    return new Response(null, { status: 303, headers: { Location: "/en?auth=failed", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  }
}