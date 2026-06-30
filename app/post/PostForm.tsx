"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { SCENE_OPTIONS } from "@/lib/quiz";
import { submitPost, type PostFormState } from "./actions";

const initialState: PostFormState = { ok: false, message: "" };

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
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-base font-bold text-foreground">{state.message}</p>
        <p className="mt-2 text-sm text-muted">掲載まで少し時間がかかります。ありがとうございます。</p>
        <div className="mt-5 flex justify-center gap-4 text-sm">
          <Link href="/shops" className="font-medium text-accent hover:underline">
            店舗を探す →
          </Link>
          <Link href="/post" className="text-muted hover:text-foreground">
            続けて投稿する
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.message && !state.ok && (
        <p className="rounded-md border border-accent/30 bg-accent-soft px-3 py-2 text-sm text-accent-dark">
          {state.message}
        </p>
      )}

      <Field label="店舗" required>
        <select
          name="shopId"
          required
          defaultValue={initialShopId}
          className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
        >
          <option value="" disabled>
            店舗を選ぶ
          </option>
          {shops.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}（{s.area}）
            </option>
          ))}
        </select>
      </Field>

      <Field label="写真（任意）">
        <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-card px-3 py-6 text-sm text-muted hover:border-accent">
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
            <img src={preview} alt="プレビュー" className="max-h-56 rounded-md object-contain" />
          ) : (
            <span>タップして写真を選ぶ（自分で撮った写真のみ）</span>
          )}
        </label>
      </Field>

      <Field label="食べたメニュー名" required>
        <input
          type="text"
          name="menuName"
          required
          placeholder="例：ラーメン＋ライス"
          className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="支払った金額（任意）">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">¥</span>
          <input
            type="number"
            name="priceYen"
            inputMode="numeric"
            min={0}
            max={100000}
            placeholder="950"
            className="w-32 rounded-md border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
          />
        </div>
      </Field>

      <Field label="一言コメント（任意）">
        <textarea
          name="body"
          rows={3}
          maxLength={300}
          placeholder="味・量・並び・雰囲気など、一言で。"
          className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </Field>

      <Field label="シーン（任意・複数可）">
        <div className="flex flex-wrap gap-2">
          {SCENE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="cursor-pointer rounded-full border border-border px-3 py-1.5 text-sm text-foreground has-[:checked]:border-accent has-[:checked]:bg-accent has-[:checked]:text-white"
            >
              <input type="checkbox" name="scene" value={opt.value} className="sr-only" />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

      <Field label="ニックネーム（任意）">
        <input
          type="text"
          name="nickname"
          maxLength={30}
          placeholder="慶應太郎 / 空欄でもOK"
          className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </Field>

      <p className="text-xs text-muted">
        投稿は確認後に掲載されます。掲載できるのは自分で撮った写真、または許可を得た写真だけです。
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-foreground px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto sm:self-start sm:px-10"
      >
        {pending ? "送信中…" : "投稿する"}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {children}
    </div>
  );
}
