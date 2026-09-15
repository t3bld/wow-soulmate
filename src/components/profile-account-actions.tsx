"use client";

import { useActionState, useId, useRef } from "react";
import { LogOut, Trash2, X } from "lucide-react";
import { logout, removeProfile } from "@/app/[locale]/profile/actions";
import type { Locale } from "@/i18n/config";
import { profileOverviewText, profileText } from "@/i18n/profile";
import { Button } from "./ui/button";

export function ProfileAccountActions({ locale, canDelete }: { locale: Locale; canDelete: boolean }) {
  const text = profileText[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [, deleteAction, pending] = useActionState(async (_previous: void, form: FormData) => {
    await removeProfile(locale, form);
  }, undefined);

  return <div className="profile-account-actions">
    <form action={logout.bind(null, locale)}><Button type="submit" className="secondary-button" disabled={pending}><LogOut size={16} aria-hidden="true" />{text.logout}</Button></form>
    {canDelete && <>
      <Button type="button" className="secondary-button" disabled={pending} onClick={() => dialogRef.current?.showModal()}><Trash2 size={16} aria-hidden="true" />{text.delete}</Button>
      <dialog ref={dialogRef} className="profile-delete-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={event => { if (pending) event.preventDefault(); }} onKeyDown={event => {
        if (event.key === "Escape") {
          event.preventDefault();
          if (!pending) dialogRef.current?.close();
        }
      }}>
        <h2 id={titleId}>{text.delete}</h2>
        <p id={descriptionId}>{text.confirmDelete}</p>
        <form action={deleteAction} aria-busy={pending}>
          <input type="hidden" name="confirmDelete" value="on" />
          <div className="profile-dialog-actions">
            <Button type="button" className="secondary-button" autoFocus disabled={pending} onClick={() => dialogRef.current?.close()}><X size={16} aria-hidden="true" />{profileOverviewText[locale].cancel}</Button>
            <Button type="submit" disabled={pending}><Trash2 size={16} aria-hidden="true" />{text.delete}</Button>
          </div>
        </form>
      </dialog>
    </>}
  </div>;
}