"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { SCENE_OPTIONS } from "@/lib/quiz";
import { copy } from "@/content/site-copy";
import { button } from "@/lib/design";
import { submitPost, type PostFormState } from "./actions";

const initialState: PostFormState = { ok: false, message: "" };
const f = copy.post.fields;

export default function PostForm({
  shops,
  initialShopId,
}: {
  shops: { id: string; name: string; area: string }[];
  initialShopId: string;
}) {
  const [state, formAction, pending] = useActionState(submitPost, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  if (state.ok) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-lg font-bold tracking-tight text-foreground">{copy.post.successTitle}</p>
        <p className="mt-2 text-sm text-muted">{copy.post.successBody}</p>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <Link href="/shops" className={button.link}>
            {copy.post.successExplore}
          </Link>
          <Link href="/post" className="text-muted hover:text-foreground">
            {copy.post.successAgain}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.message && !state.ok && (
        <p className="rounded-lg border border-accent/30 bg-accent-soft px-3.5 py-2.5 text-sm text-accent-dark">
          {state.message}
        </p>
      )}

      <Field label={f.shop} required>
        <select
          name="shopId"
          required
          defaultValue={initialShopId}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm focus:border-foreground focus:outline-none"
        >
          <option value="" disabled>
            {f.shopPlaceholder}
          </option>
          {shops.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}（{s.area}）
            </option>
          ))}
        </select>
      </Field>

      <Field label={f.photo} optional>
        <label className="flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-card px-3 py-8 text-sm text-muted transition-colors hover:border-foreground">
          <input
            type="file"
            name="image"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : null);
            }}
          />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className="max-h-60 rounded-md object-contain" />
          ) : (
            <span>{f.photoHint}</span>
          )}
        </label>
      </Field>

      <Field label={f.menu} required>
        <input
          type="text"
          name="menuName"
          required
          placeholder={f.menuPlaceholder}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
        />
      </Field>

      <Field label={f.price} optional>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">¥</span>
          <input
            type="number"
            name="priceYen"
            inputMode="numeric"
            min={0}
            max={100000}
            placeholder={f.pricePlaceholder}
            className="w-32 rounded-lg border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
          />
        </div>
      </Field>

      <Field label={f.note} optional>
        <textarea
          name="body"
          rows={3}
          maxLength={300}
          placeholder={f.notePlaceholder}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
        />
      </Field>

      <Field label={f.scene} optional>
        <div className="flex flex-wrap gap-2">
          {SCENE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-white"
            >
              <input type="checkbox" name="scene" value={opt.value} className="sr-only" />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

      <Field label={f.name} optional>
        <input
          type="text"
          name="nickname"
          maxLength={30}
          placeholder={f.namePlaceholder}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
        />
      </Field>

      <p className="text-xs leading-relaxed text-muted">{copy.post.rights}</p>

      <button
        type="submit"
        disabled={pending}
        className={`${button.primary} w-full disabled:opacity-50 sm:w-auto sm:self-start sm:px-12`}
      >
        {pending ? copy.post.submitting : copy.post.submit}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  optional,
  children,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-accent">*</span>}
        {optional && <span className="text-[11px] font-normal text-muted">{copy.post.fields.optional}</span>}
      </label>
      {children}
    </div>
  );
}
