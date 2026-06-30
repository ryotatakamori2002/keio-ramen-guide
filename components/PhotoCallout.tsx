// 写真提供の導線。フォームは作らず、mailto と DM想定の文面で受ける（MVP）。
// 公開時はメールアドレス/SNSハンドルを実在のものに差し替えること。
const CONTACT_EMAIL = "ramen-guide@example.com";

export default function PhotoCallout({
  shopName,
  variant = "full",
}: {
  shopName?: string;
  variant?: "full" | "compact";
}) {
  const subject = shopName ? `ラーメン写真の提供（${shopName}）` : "ラーメン写真の提供";
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;

  if (variant === "compact") {
    return (
      <p className="mt-2 text-[11px] leading-relaxed text-muted">
        {shopName ? `「${shopName}」の写真、持ってる？ ` : "この店の写真、持ってる？ "}
        <a href={mailto} className="text-accent hover:underline">
          提供する
        </a>
        （許可をもらった写真だけ掲載します）
      </p>
    );
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-bold text-foreground">慶應生のラーメン写真、募集中</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        いまは全店「写真募集中」です。自分で撮った写真や、お店・友達から掲載許可をもらった写真を集めています。無断転載はしません。クレジット（撮影者名）を明記して掲載します。
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <a href={mailto} className="font-medium text-accent hover:underline">
          メールで提供する
        </a>
        <span className="text-xs text-muted">X / Instagram のDMでもOK（運用者まで）</span>
      </div>
    </section>
  );
}
