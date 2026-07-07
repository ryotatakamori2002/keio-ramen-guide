// デザインシステム（トークン）
// 色・余白・タイポ・角丸・ボタン/カードの見た目をここに集約する。
// 色そのものは app/globals.css の CSS変数（--background など）で定義し、
// ここでは Tailwind のクラス文字列として「使い方」をまとめる。
// 余白や色のリズムを変えたい時は、まずこのファイルを見る。

// ── レイアウト ─────────────────────────────
export const container = "mx-auto w-full max-w-5xl px-5 sm:px-8";
export const sectionGap = "py-14 sm:py-20"; // セクション間の縦リズム
export const stack = "flex flex-col";

// ── タイポグラフィ ─────────────────────────
export const type = {
  // セクション上の小さなラベル（字間広めの和文）
  eyebrow: "text-[11px] font-semibold tracking-[0.14em] text-muted",
  // トップの主役見出し（text-balance で改行を自然に）
  display: "text-balance tracking-display text-[2rem] font-bold leading-[1.15] text-foreground sm:text-[2.75rem]",
  // ページ見出し
  h1: "tracking-display text-2xl font-bold leading-tight text-foreground sm:text-3xl",
  // セクション見出し
  h2: "text-lg font-bold tracking-tight text-foreground",
  // 本文
  body: "text-sm leading-relaxed text-foreground/80 sm:text-[15px]",
  lead: "text-base leading-relaxed text-muted sm:text-lg",
  small: "text-xs text-muted",
};

// ── 角丸（小さめに統一）───────────────────────
export const radius = {
  card: "rounded-lg",
  control: "rounded-md",
  pill: "rounded-full",
};

// ── ボタン ─────────────────────────────────
// 黒ボタンを主役に。角丸は小さめ。赤はリンク/強調のみ。
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors";
export const button = {
  // 主役（黒）
  primary: `${buttonBase} bg-foreground px-6 py-3 text-background hover:opacity-90`,
  // 副次（枠線）
  secondary: `${buttonBase} border border-border px-6 py-3 text-foreground hover:border-foreground`,
  // 小さめ
  small: `${buttonBase} border border-border px-4 py-2 text-foreground hover:border-foreground`,
  // テキストリンク的（赤はここだけ）
  link: "text-sm font-medium text-accent underline-offset-4 hover:underline",
  // 控えめなテキストリンク
  quiet: "text-sm text-muted underline-offset-4 hover:text-foreground",
};

// ── カード（薄い罫線中心・影は控えめ）──────────
export const card = {
  base: "rounded-lg border border-border bg-card",
  pad: "p-5",
  hover: "transition-colors hover:border-foreground/25",
};

// ── タグ/ピル ──────────────────────────────
export const tag = {
  // 控えめな用途タグ
  muted: "rounded-full bg-background px-2 py-0.5 text-xs text-muted",
  // 状態ラベル（悪目立ちさせない）
  status: "rounded-full border border-border px-2 py-0.5 text-[10px] text-muted",
};
