"use client";

import Link from "next/link";
import { useActionState } from "react";
import { copy } from "@/content/site-copy";
import { button } from "@/lib/design";
import { submitShopRequest, type RequestFormState } from "./actions";

const initialState: RequestFormState = { ok: false, message: "" };
const f = copy.request.fields;

const inputClass =
  "w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none";

export default function RequestForm() {
  const [state, formAction, pending] = useActionState(submitShopRequest, initialState);

  if (state.ok) {
    return (
      <div className="border-y-2 border-foreground py-10 text-center">
        <p className="text-lg font-bold tracking-tight text-foreground">{copy.request.successTitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{state.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shops" className={button.small}>
            {copy.request.backToShops}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.message && !state.ok && (
        <p className="rounded-md border border-accent/30 bg-accent-soft px-3.5 py-2.5 text-sm text-accent-dark">
          {state.message}
        </p>
      )}

      <Field label={f.name} required>
        <input type="text" name="shopName" required maxLength={60} placeholder={f.namePlaceholder} className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={f.area}>
          <input type="text" name="area" maxLength={20} placeholder={f.areaPlaceholder} className={inputClass} />
        </Field>
        <Field label={f.station}>
          <input type="text" name="station" maxLength={20} placeholder={f.stationPlaceholder} className={inputClass} />
        </Field>
      </div>

      <Field label={f.mapUrl}>
        <input type="url" name="mapUrl" placeholder={f.mapUrlPlaceholder} className={inputClass} />
      </Field>

      <Field label={f.genre}>
        <input type="text" name="genre" maxLength={20} placeholder={f.genrePlaceholder} className={inputClass} />
      </Field>

      <Field label={f.reason}>
        <textarea name="reason" rows={3} maxLength={500} placeholder={f.reasonPlaceholder} className={inputClass} />
      </Field>

      <Field label={f.requester}>
        <input type="text" name="requester" maxLength={30} placeholder={f.requesterPlaceholder} className={inputClass} />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className={`${button.primary} w-full disabled:opacity-50 sm:w-auto sm:self-start sm:px-12`}
      >
        {pending ? copy.request.submitting : copy.request.submit}
      </button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="text-accent">*</span>
        ) : (
          <span className="text-[11px] font-normal text-muted">任意</span>
        )}
      </label>
      {children}
    </div>
  );
}
