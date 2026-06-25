import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-center">
      <h1 className="font-serif text-xl text-foreground">ページが見つかりませんでした</h1>
      <p className="text-sm text-muted">お探しのお店やページは存在しないか、移動した可能性があります。</p>
      <Link href="/shops" className="mt-2 text-sm text-accent underline underline-offset-4">
        店舗を探す →
      </Link>
    </div>
  );
}
