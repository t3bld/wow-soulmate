import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import { authClient, authSettings, loginTransaction } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") === "de" ? "de" : "en";
  try {
    const config = await authClient();
    const transaction = await loginTransaction();
    transaction.state = oidc.randomState();
    transaction.nonce = oidc.randomNonce();
    transaction.verifier = oidc.randomPKCECodeVerifier();
    transaction.createdAt = Date.now();
    transaction.locale = locale;
    const url = oidc.buildAuthorizationUrl(config, {
      scope: "openid", redirect_uri: authSettings().redirectUri,
      state: transaction.state, nonce: transaction.nonce,
      code_challenge: await oidc.calculatePKCECodeChallenge(transaction.verifier), code_challenge_method: "S256",
    });
    await transaction.save();
    return NextResponse.redirect(url, { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  } catch {
    return new NextResponse(locale === "de" ? "Battle.net-Login ist noch nicht eingerichtet oder derzeit nicht erreichbar. Bitte kehre zur Website zurück." : "Battle.net login is not configured or is temporarily unavailable. Please return to the website.", { status: 503, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" } });
  }
}