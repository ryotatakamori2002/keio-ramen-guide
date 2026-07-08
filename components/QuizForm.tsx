"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  LOCATION_OPTIONS,
  QUEUE_OPTIONS,
  RICHNESS_OPTIONS,
  SCENE_OPTIONS,
  TASTE_OPTIONS,
  type QuizAnswers,
} from "@/lib/quiz";
import { getShopById } from "@/lib/shops";
import { copy } from "@/content/site-copy";
import { button } from "@/lib/design";

// 「気分で選ぶ」を、フォームではなく1問ずつ進む体験にする。
// - 大きな選択カードをタップ→0.26秒後に次の質問へ
// - 進行バーと「前の質問へ」で現在地を見失わせない
// - PCでは右に実写真（設問ごとにクロスフェード）
interface QuestionConfig {
  key: keyof QuizAnswers;
  title: string;
  options: readonly { value: string; label: string }[];
}

const QUESTIONS: QuestionConfig[] = [
  { key: "location", title: "いま、どのエリア？", options: LOCATION_OPTIONS },
  { key: "scene", title: "きょうは、どんな場面？", options: SCENE_OPTIONS },
  { key: "taste", title: "食べたい系統は？", options: TASTE_OPTIONS },
  { key: "richness", title: "重さは、どのくらい？", options: RICHNESS_OPTIONS },
  { key: "queue", title: "行列は、どうする？", options: QUEUE_OPTIONS },
];

// 右カラムの写真は3店の実写真を順番に使う
const STEP_PHOTO_SHOPS = ["hiyoshi-musashiya", "mita-jiro", "yokohama-ishinshoten"];

export default function QuizForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const photoShop = getShopById(STEP_PHOTO_SHOPS[step % STEP_PHOTO_SHOPS.length]);
  const answered = answers[q.key];

  function select(value: string) {
    setAnswers((prev) => ({ ...prev, [q.key]: value }));
    if (step < total - 1) {
      window.setTimeout(() => setStep((s) => Math.min(s + 1, total - 1)), 260);
    } else {
      setDone(true);
    }
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  function goResults() {
    const params = new URLSearchParams(answers as Record<string, string>);
    router.push(`/results?${params.toString()}`);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
      <div>
        {/* 進行表示 */}
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xs font-semibold tabular-nums tracking-[0.14em] text-muted">
            {copy.quiz.progress(step + 1, total)}
          </p>
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="text-xs text-muted underline underline-offset-4 transition-colors hover:text-foreground"
            >
              ← {copy.quiz.back}
            </button>
          )}
        </div>
        <div className="mt-2.5 h-[3px] w-full bg-border" role="presentation">
          <motion.div
            className="h-full bg-accent"
            initial={false}
            animate={{ width: `${(((done ? total : step) + (done ? 0 : 0.15)) / total) * 100}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* 質問（1問ずつスライド） */}
        <AnimatePresence mode="wait">
          <motion.fieldset
            key={step}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <legend className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{q.title}</legend>
            <div className={`mt-5 grid gap-2.5 ${q.options.length > 6 ? "grid-cols-2" : "sm:grid-cols-2"}`}>
              {q.options.map((option) => {
                const active = answered === option.value;
                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => select(option.value)}
                    whileTap={{ scale: 0.97 }}
                    aria-pressed={active}
                    className={`min-h-[3.25rem] border px-4 py-3 text-left text-[15px] font-medium transition-colors ${
                      active
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground hover:border-foreground"
                    }`}
                  >
                    {option.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.fieldset>
        </AnimatePresence>

        {/* 最終問に答えたら結果へ */}
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9"
          >
            <button type="button" onClick={goResults} className={`${button.primary} w-full sm:w-auto sm:px-14`}>
              {copy.quiz.submit}
            </button>
          </motion.div>
        )}
      </div>

      {/* 右の実写真（lg以上・設問ごとにクロスフェード） */}
      {photoShop?.thumbnailImageUrl && (
        <div className="relative hidden self-start overflow-hidden lg:block" aria-hidden>
          <div className="relative h-[460px] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Image
                  src={photoShop.thumbnailImageUrl}
                  alt=""
                  fill
                  sizes="340px"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#11100e]/80 to-transparent p-4 pt-10">
                  <p className="text-xs text-[#cfc6b8]">{photoShop.name}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
