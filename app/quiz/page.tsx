import type { Metadata } from "next";
import QuizForm from "@/components/QuizForm";
import { copy } from "@/content/site-copy";
import { type as t } from "@/lib/design";

export const metadata: Metadata = {
  title: `${copy.quiz.title} | ${copy.serviceName}`,
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-xl py-2">
      <p className={t.eyebrow}>{copy.quiz.eyebrow}</p>
      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">{copy.quiz.title}</h1>
      <p className="mt-2 text-sm text-muted">{copy.quiz.subtitle}</p>
      <div className="mt-8">
        <QuizForm />
      </div>
    </div>
  );
}
