import { LogOut, Monitor } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { securityText } from "@/i18n/security";
import { currentIdentity } from "@/lib/auth";
import { database } from "@/lib/profile-store";
import { manageSessions } from "@/app/[locale]/profile/actions";
import { Button } from "./ui/button";

export async function ProfileSessions({ locale }: { locale: Locale }) {
  const identity = await currentIdentity();
  if (!identity) return null;
  const text = securityText[locale];
  const sessions = await database().session.findMany({
    where: { userId: identity.userId, expiresAt: { gt: new Date() } },
    select: { id: true, createdAt: true, expiresAt: true, userAgent: true, ipAddress: true },
    orderBy: { createdAt: "desc" }, take: 50,
  });
  const format = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" });
  return <section className="profile-sessions" aria-labelledby="sessions-title">
    <h2 id="sessions-title">{text.title}</h2>
    <ul>{sessions.map(session => <li key={session.id}>
      <div className="session-details">
        <strong><Monitor size={16} aria-hidden="true" />{session.id === identity.session.id ? text.current : text.other}</strong>
        <p>{session.userAgent || session.ipAddress}</p>
        <p>{text.started}: <time dateTime={session.createdAt.toISOString()}>{format.format(session.createdAt)} UTC</time><br />{text.expires}: <time dateTime={session.expiresAt.toISOString()}>{format.format(session.expiresAt)} UTC</time></p>
      </div>
      <form action={manageSessions.bind(null, locale)}>
        <input type="hidden" name="mode" value="one" /><input type="hidden" name="sessionId" value={session.id} />
        <Button type="submit" className="secondary-button"><LogOut size={16} aria-hidden="true" />{text.revoke}</Button>
      </form>
    </li>)}</ul>
    <div className="session-controls">
      <form action={manageSessions.bind(null, locale)}><input type="hidden" name="mode" value="others" /><Button type="submit" className="secondary-button"><LogOut size={16} aria-hidden="true" />{text.others}</Button></form>
      <form action={manageSessions.bind(null, locale)}><input type="hidden" name="mode" value="all" /><Button type="submit" className="secondary-button"><LogOut size={16} aria-hidden="true" />{text.all}</Button></form>
    </div>
  </section>;
}