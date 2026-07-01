import type { Metadata } from "next";
import Link from "next/link";
import { SHOPS } from "@/lib/shops";
import { recommend } from "@/lib/recommend";
import ResultCard from "@/components/ResultCard";
import {
  DEFAULT_QUIZ_ANSWERS,
  LOCATION_OPTIONS,
  QUEUE_OPTIONS,
  RICHNESS_OPTIONS,
  SCENE_OPTIONS,
  TASTE_OPTIONS,
  type QuizAnswers,
} from "@/lib/quiz";
import { copy } from "@/content/site-copy";
import { type as t } from "@/lib/design";

export const metadata: Metadata = {
  title: `${copy.results.title} | ${copy.serviceName}`,
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
    <div className="py-2">
      <p className={t.eyebrow}>{copy.results.eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.results.title}</h1>
      <p className="mt-2 text-sm text-muted">{copy.results.subtitle}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result, i) => (
          <ResultCard key={result.shop.id} result={result} rank={i + 1} />
        ))}
      </div>

      <Link href="/quiz" className="mt-8 inline-block text-sm font-medium text-accent hover:underline">
        {copy.results.again} →
      </Link>
    </div>
  );
}
