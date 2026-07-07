"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { motion } from "motion/react";
import { SCENE_OPTIONS } from "@/lib/quiz";
import { copy } from "@/content/site-copy";
import { button } from "@/lib/design";
import Stagger from "@/components/motion/Stagger";
import ShopSelect, { type ShopOption } from "./ShopSelect";
import { submitPost, type PostFormState } from "./actions";

const initialState: PostFormState = { ok: false, message: "" };
const f = copy.post.fields;

export default function PostForm({
  shops,
  initialShopId,
}: {
  shops: ShopOption[];
  initialShopId: string;
}) {
  const [state, formAction, pending] = useActionState(submitPost, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  if (state.ok) {
    return (
      <div className="border-y-2 border-foreground py-10 text-center">
        <p className="text-lg font-bold tracking-tight text-foreground">{copy.post.successTitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">{copy.post.successBody}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/post" className={button.small}>
            {copy.post.successAgain}
          </Link>
          <Link href="/shops" className={button.small}>
            {copy.post.successExplore}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <Stagger className="flex flex-col gap-6" gap={0.05}>
        {state.message && !state.ok && (
          <p className="rounded-md border border-accent/30 bg-accent-soft px-3.5 py-2.5 text-sm text-accent-dark">
            {state.message}
          </p>
        )}

        <Field label={f.shop} required>
          <ShopSelect shops={shops} initialShopId={initialShopId} />
        </Field>

        <Field label={f.menu} required>
          <input
            type="text"
            name="menuName"
            required
            placeholder={f.menuPlaceholder}
            className="w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
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
              className="w-32 rounded-md border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
            />
          </div>
        </Field>

        <Field label={f.photo} optional>
          <label className="group/photo flex cursor-pointer items-center gap-3.5 rounded-md border border-dashed border-border bg-card px-3.5 py-3 transition-colors hover:border-foreground">
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
              <>
                {/* 貼った瞬間が気持ちいいように、少し落ちて傾いて収まる */}
                <motion.img
                  key={preview}
                  src={preview}
                  alt="選択中の写真"
                  initial={{ opacity: 0, y: -10, rotate: 3, scale: 1.04 }}
                  animate={{ opacity: 1, y: 0, rotate: -1.5, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="h-20 w-20 shrink-0 rounded-sm border border-border object-cover shadow-[2px_3px_0_rgba(17,16,14,0.08)]"
                />
                <span className="text-xs text-muted">{f.photoChange}</span>
              </>
            ) : (
              <>
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-muted transition-transform duration-300 group-hover/photo:rotate-90"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                    <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="text-sm text-muted">{f.photoHint}</span>
              </>
            )}
          </label>
        </Field>

        <Field label={f.note} optional>
          <textarea
            name="body"
            rows={3}
            maxLength={300}
            placeholder={f.notePlaceholder}
            className="w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
          />
        </Field>

        <Field label={f.scene} optional>
          <div className="flex flex-wrap gap-2">
            {SCENE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors has-[:checked]:border-foreground has-[:checked]:bg-foreground has-[:checked]:text-background"
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
            className="w-full rounded-md border border-border bg-card px-3.5 py-2.5 text-sm placeholder:text-muted focus:border-foreground focus:outline-none"
          />
        </Field>

        <div className="border-t border-border pt-4 text-xs leading-relaxed text-muted">
          <p>{copy.post.moderationNote}</p>
          <p className="mt-1">{copy.post.rights}</p>
        </div>

        <button
          type="submit"
          disabled={pending}
          className={`${button.primary} w-full disabled:opacity-50 sm:w-auto sm:self-start sm:px-12`}
        >
          {pending ? copy.post.submitting : copy.post.submit}
        </button>
      </Stagger>
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
