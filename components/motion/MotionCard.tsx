"use client";

import { motion } from "motion/react";

// カードに控えめな hover の浮き上がりを与える。派手な拡大やバウンスはしない。
// reduced motion 時の無効化は MotionProvider（MotionConfig）が行う。
export default function MotionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
