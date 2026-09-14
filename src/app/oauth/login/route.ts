import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import { authClient, authSettings, loginTransaction } from "@/lib/auth";
import { defaultLocale, isLocale } from "@/i18n/config";
import { profileText } from "@/i18n/profile";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const requestedLocale = request.nextUrl.searchParams.get("locale") ?? "";
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
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
    return new NextResponse(profileText[locale].notReady, { status: 503, headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" } });
  }
}