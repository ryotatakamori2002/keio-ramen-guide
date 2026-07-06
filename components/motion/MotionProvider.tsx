"use client";

import { MotionConfig } from "motion/react";

// reduced motion への対応をここで一元管理する。
// 各コンポーネント側で useReducedMotion によって DOM 構造を切り替えると、
// SSR とクライアントの初回描画がずれてハイドレーションが壊れるため、
// MotionConfig に任せて透明度以外のアニメーションを自動で無効化する。
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
