"use client";

import { motion } from "motion/react";

// 見出し用の控えめな出現。日本語を壊さないよう、文字分割はせず塊でフェード＋上昇させる。
// reduced motion 時の無効化は MotionProvider（MotionConfig）が行う。
export default function AnimatedText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {text}
    </motion.span>
  );
}
