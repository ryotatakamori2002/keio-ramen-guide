import type { Metadata } from "next";
import QuizForm from "@/components/QuizForm";

export const metadata: Metadata = {
  title: "気分診断 | Keio Ramen Guide",
};

export default function QuizPage() {
  return (
    <div>
      <h1 className="text-lg font-bold text-foreground">気分診断</h1>
      <p className="mt-1 text-sm text-muted">7つの質問に答えるだけ。30秒で今のあなたに合う一杯が見つかります。</p>
      <div className="mt-5">
        <QuizForm />
      </div>
    </div>
  );
}
