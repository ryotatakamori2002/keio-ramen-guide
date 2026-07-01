"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

// 画面最上部の細いスクロール進捗バー。reduced motion 時は表示しない。
export default function PageProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.2 });

  if (reduce) return null;

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent/60"
      aria-hidden
    />
  );
}
