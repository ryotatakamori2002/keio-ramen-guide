// ブランドマーク。深い赤の地に、白い丼と箸。
// app/icon.svg（favicon）と同じ図形をヘッダーやOG画像で使い回す。
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <rect width="100" height="100" rx="18" fill="#b23a2e" />
      <path d="M18 46h64a32 32 0 0 1-64 0z" fill="#ffffff" />
      <rect x="40" y="81" width="20" height="6" rx="2" fill="#ffffff" />
      <path d="M16 34 84 17" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
      <path d="M18 43 86 26" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
