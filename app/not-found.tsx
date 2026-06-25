import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <p className="text-4xl">🍜</p>
      <h1 className="text-lg font-bold text-foreground">ページが見つかりませんでした</h1>
      <p className="text-sm text-muted">お探しのお店やページは存在しないか、移動した可能性があります。</p>
      <Link
        href="/shops"
        className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark"
      >
        店舗一覧に戻る
      </Link>
    </div>
  );
}
