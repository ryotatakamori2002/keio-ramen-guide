"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

interface QuestionConfig<K extends keyof QuizAnswers> {
  key: K;
  title: string;
  options: { value: QuizAnswers[K]; label: string }[];
}

const QUESTIONS: QuestionConfig<keyof QuizAnswers>[] = [
  { key: "location", title: "今いる場所は？", options: LOCATION_OPTIONS },
  { key: "scene", title: "今のシーンは？", options: SCENE_OPTIONS },
  { key: "taste", title: "味の好みは？", options: TASTE_OPTIONS },
  { key: "richness", title: "重さは？", options: RICHNESS_OPTIONS },
  { key: "volume", title: "量は？", options: VOLUME_OPTIONS },
  { key: "beginner", title: "初心者向け度は？", options: BEGINNER_OPTIONS },
  { key: "queue", title: "並びは平気？", options: QUEUE_OPTIONS },
];

export default function QuizForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT_QUIZ_ANSWERS);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(answers as unknown as Record<string, string>);
    router.push(`/results?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {QUESTIONS.map((question) => (
        <fieldset key={question.key}>
          <legend className="mb-2 text-sm font-bold text-foreground">{question.title}</legend>
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) => {
              const active = answers[question.key] === option.value;
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.key]: option.value }))}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-accent bg-accent text-white"
                      : "border-border bg-card text-foreground hover:border-accent"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <button
        type="submit"
        className="mt-2 rounded-full bg-accent px-6 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-accent-dark"
      >
        診断結果を見る
      </button>
    </form>
  );
}
