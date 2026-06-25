import type { Metadata } from "next";
import Link from "next/link";
import QuizForm from "@/components/QuizForm";

export const metadata: Metadata = {
  title: "気分で選ぶ | Keio Ramen Guide",
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-xl">
      <p className="text-xs text-muted">
        <Link href="/shops" className="font-medium text-foreground hover:text-accent">
          店舗を探す
        </Link>{" "}
        の代わりに、気分から選びたい時に。
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">気分で選ぶ</h1>
      <p className="mt-2 text-sm text-muted">5つの質問、30秒。今の気分に合う一杯を絞り込みます。</p>
      <div className="mt-8">
        <QuizForm />
      </div>
    </div>
  );
}
