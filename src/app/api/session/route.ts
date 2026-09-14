import { NextResponse } from "next/server";
import { currentSubject } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Boolean only — the landing page stays statically generated and asks for sign-in state after hydration.
export async function GET() {
  const signedIn = (await currentSubject()) !== null;
  return NextResponse.json({ signedIn }, { headers: { "Cache-Control": "no-store" } });
}
