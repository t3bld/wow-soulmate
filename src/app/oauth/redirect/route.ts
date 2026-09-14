import { NextRequest, NextResponse } from "next/server";
import * as oidc from "openid-client";
import { authClient, authSettings, identitySession, loginTransaction } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  let locale = "en";
  try {
    const settings = authSettings();
    const transaction = await loginTransaction();
    const { state, nonce, verifier, createdAt } = transaction;
    locale = transaction.locale === "de" ? "de" : "en";
    transaction.destroy();
    if (!state || !nonce || !verifier || !createdAt || Date.now() - createdAt > 600000 || createdAt > Date.now()) throw new Error("Expired transaction");
    if (request.nextUrl.searchParams.get("state") !== state) throw new Error("Invalid state");
    const callback = new URL(settings.redirectUri);
    callback.search = request.nextUrl.search;
    const tokens = await oidc.authorizationCodeGrant(await authClient(), callback, {
      expectedState: state, expectedNonce: nonce, pkceCodeVerifier: verifier, idTokenExpected: true,
    });
    const subject = tokens.claims()?.sub;
    if (!subject) throw new Error("Missing subject");
    const session = await identitySession();
    session.subject = subject;
    session.expiresAt = Date.now() + 86400000;
    await session.save();
    return NextResponse.redirect(new URL(`/${locale}/profile`, settings.origin), { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  } catch {
    const target = new URL(`/${locale}/profile?auth=failed`, request.url);
    return NextResponse.redirect(target, { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  }
}