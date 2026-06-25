import type { Metadata } from "next";
import Link from "next/link";
import { SHOPS } from "@/lib/shops";
import { recommend } from "@/lib/recommend";
import ResultCard from "@/components/ResultCard";
import {
  BEGINNER_OPTIONS,
  DEFAULT_QUIZ_ANSWERS,
  LOCATION_OPTIONS,
  QUEUE_OPTIONS,
  RICHNESS_OPTIONS,
  SCENE_OPTIONS,
  TASTE_OPTIONS,
  VOLUME_OPTIONS,
  type QuizAnswers,
} from "@/lib/quiz";

export const metadata: Metadata = {
  title: "診断結果 | Keio Ramen Guide",
};

function pickValid<T extends string>(value: string | undefined, options: { value: T }[], fallback: T): T {
  const found = options.find((option) => option.value === value);
  return found ? found.value : fallback;
}

function parseAnswers(sp: Record<string, string | string[] | undefined>): QuizAnswers {
  const get = (key: string) => {
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };
  return {
    location: pickValid(get("location"), LOCATION_OPTIONS, DEFAULT_QUIZ_ANSWERS.location),
    scene: pickValid(get("scene"), SCENE_OPTIONS, DEFAULT_QUIZ_ANSWERS.scene),
    taste: pickValid(get("taste"), TASTE_OPTIONS, DEFAULT_QUIZ_ANSWERS.taste),
    richness: pickValid(get("richness"), RICHNESS_OPTIONS, DEFAULT_QUIZ_ANSWERS.richness),
    volume: pickValid(get("volume"), VOLUME_OPTIONS, DEFAULT_QUIZ_ANSWERS.volume),
    beginner: pickValid(get("beginner"), BEGINNER_OPTIONS, DEFAULT_QUIZ_ANSWERS.beginner),
    queue: pickValid(get("queue"), QUEUE_OPTIONS, DEFAULT_QUIZ_ANSWERS.queue),
  };
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const answers = parseAnswers(sp);
  const results = recommend(SHOPS, answers, 5);

  return (
    <div>
      <h1 className="text-lg font-bold text-foreground">診断結果</h1>
      <p className="mt-1 text-sm text-muted">あなたの今の気分に合うお店はこちら。</p>

      <div className="mt-4 flex flex-col gap-3">
        {results.map((result, i) => (
          <ResultCard key={result.shop.id} result={result} rank={i + 1} />
        ))}
      </div>

      <Link
        href="/quiz"
        className="mt-5 block rounded-full border border-border bg-card py-3 text-center text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        もう一度診断する
      </Link>
    </div>
  );
}
