import Link from "next/link";
import { LIVE_AREAS, UPCOMING_AREAS } from "@/lib/areas";
import { copy } from "@/content/site-copy";

// 掲載中／追加予定エリアの整理。未掲載エリア（信濃町・SFC・渋谷など）を
// なかったことにせず、正直に「これから」と見せてリクエストへつなぐ。控えめな帯。
export default function ComingSoonAreas() {
  return (
    <div className="border-t border-border pt-5">
      <div className="flex flex-col gap-2.5 text-xs leading-relaxed">
        <p>
          <span className="mr-3 font-semibold text-foreground">{copy.comingAreas.liveLabel}</span>
          <span className="text-muted">{LIVE_AREAS.map((a) => a.name).join("・")}</span>
        </p>
        <p>
          <span className="mr-3 font-semibold text-foreground">{copy.comingAreas.upcomingLabel}</span>
          <span className="text-muted">
            {UPCOMING_AREAS.map((a) => a.name).join("・")}
            <span className="ml-1.5">ほか</span>
          </span>
        </p>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted">
        {copy.comingAreas.note}{" "}
        <Link
          href="/shops/request"
          className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
        >
          {copy.comingAreas.requestCta}
        </Link>
      </p>
    </div>
  );
}
