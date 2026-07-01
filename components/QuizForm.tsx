"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

interface QuestionConfig<K extends keyof QuizAnswers> {
  key: K;
  title: string;
  options: { value: QuizAnswers[K]; label: string }[];
}

const QUESTIONS: QuestionConfig<keyof QuizAnswers>[] = [
  { key: "location", title: "どこにいる？", options: LOCATION_OPTIONS },
  { key: "scene", title: "今日はどんな気分？", options: SCENE_OPTIONS },
  { key: "taste", title: "何系の気分？", options: TASTE_OPTIONS },
  { key: "richness", title: "どれくらい重い？", options: RICHNESS_OPTIONS },
  { key: "queue", title: "並べる？", options: QUEUE_OPTIONS },
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {QUESTIONS.map((question, i) => (
        <fieldset key={question.key}>
          <legend className="mb-2.5 text-sm font-medium text-foreground">
            <span className="mr-1.5 text-muted">{i + 1}.</span>
            {question.title}
          </legend>
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) => {
              const active = answers[question.key] === option.value;
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.key]: option.value }))}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
                    active
                      ? "border-foreground bg-foreground text-white"
                      : "border-border text-muted hover:border-foreground hover:text-foreground"
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
        className="mt-1 w-full rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:w-auto sm:self-start sm:px-12"
      >
        {copy.quiz.submit}
      </button>
    </form>
  );
}
