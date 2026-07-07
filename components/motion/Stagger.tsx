"use client";

import { Children } from "react";
import { motion } from "motion/react";

// 直下の子要素を少しずつ時間差で出現させる。子をラップするので、className にレイアウト（grid/flex）を渡せる。
// reduced motion 時の無効化は MotionProvider（MotionConfig）が行う。
export default function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  y = 12,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={{ show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
