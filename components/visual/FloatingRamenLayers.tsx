"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

// Heroの背景に敷くラーメンの抽象レイヤー（丼・湯気・暖簾・麺線）。
// - 細いストロークのポスター的な線画。絵文字・かわいいイラストにはしない
// - スクロールでレイヤーごとに速度差をつけて奥行きを出す（最大±95px）
// - 装飾なので pointer-events-none / aria-hidden
// - reduced-motion とハイドレーション対策のため、パララックスはマウント後にだけ適用する
// - 実写真が用意できたら、各レイヤーを <Image> に差し替えられる構造にしてある

const CREAM = "#f7f1e8";
const GINGER = "#c88a32";
const RED = "#c53024";

const emptySubscribe = () => () => {};

export default function FloatingRamenLayers() {
  const reduce = useReducedMotion();
  // SSRとクライアント初回描画を一致させるためのマウント判定（ハイドレーション対策）
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const { scrollY } = useScroll();
  const yBowl = useTransform(scrollY, [0, 700], [0, -50]);
  const ySteam = useTransform(scrollY, [0, 700], [0, -95]);
  const yNoren = useTransform(scrollY, [0, 700], [0, -18]);
  const yNoodle = useTransform(scrollY, [0, 700], [0, 40]);
  const active = mounted && !reduce;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
      {/* 暖簾（右上・赤はここだけ強く使う） */}
      <motion.div
        style={active ? { y: yNoren } : undefined}
        className="absolute right-[5%] top-0 w-28 opacity-90 sm:w-36 lg:right-[42%]"
      >
        <NorenSvg />
      </motion.div>

      {/* 丼（左下の画面外へ断ち落とし。縁と鳴門だけ覗かせ、コピーやCTAには重ねない） */}
      <motion.div
        style={active ? { y: yBowl } : undefined}
        className="absolute -left-28 bottom-[-215px] w-[430px] opacity-70 sm:bottom-[-235px] sm:w-[500px] lg:-left-20 lg:opacity-80"
      >
        <div className="-rotate-[5deg]">
          <BowlSvg />
        </div>
      </motion.div>

      {/* 湯気（丼の上・唯一の常時ゆらぎ） */}
      <motion.div
        style={active ? { y: ySteam } : undefined}
        className="absolute left-[10%] top-6 w-20 opacity-80 sm:w-24 lg:left-[13%]"
      >
        <div className="animate-steam">
          <SteamSvg />
        </div>
      </motion.div>

      {/* 麺線（右下・PCのみ） */}
      <motion.div
        style={active ? { y: yNoodle } : undefined}
        className="absolute -right-10 bottom-[-24px] hidden w-[360px] lg:block"
      >
        <NoodleSvg />
      </motion.div>
    </div>
  );
}

function BowlSvg() {
  return (
    <svg viewBox="0 0 520 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 胴（うっすら醤油色で質量を出す） */}
      <path
        d="M36 124 C58 244 148 306 260 308 C372 306 462 244 484 124 C420 168 330 184 260 184 C190 184 100 168 36 124 Z"
        fill="#241a10"
        fillOpacity="0.5"
      />
      {/* 縁 */}
      <ellipse cx="260" cy="118" rx="226" ry="62" stroke={GINGER} strokeWidth="3" />
      <ellipse cx="260" cy="118" rx="168" ry="44" stroke={CREAM} strokeOpacity="0.4" strokeWidth="2" />
      {/* 麺の渦 */}
      <path d="M140 116 Q 200 84 262 102 Q 320 118 366 96" stroke={CREAM} strokeOpacity="0.55" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M168 132 Q 232 108 306 126" stroke={CREAM} strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
      {/* 鳴門（赤い渦はここ1つ） */}
      <circle cx="318" cy="108" r="17" fill={CREAM} fillOpacity="0.92" />
      <path d="M318 97 a11 11 0 1 1 -10 14 a7.5 7.5 0 1 0 7 -10 a4 4 0 1 0 3 6" stroke={RED} strokeWidth="2.2" strokeLinecap="round" />
      {/* 胴の稜線と帯 */}
      <path d="M36 124 C58 244 148 306 260 308 C372 306 462 244 484 124" stroke={GINGER} strokeWidth="3" />
      <path d="M118 226 C 196 258 324 258 402 226" stroke={CREAM} strokeOpacity="0.25" strokeWidth="2" />
      {/* 高台 */}
      <path d="M196 322 h128 v16 a10 10 0 0 1 -10 10 h-108 a10 10 0 0 1 -10 -10 Z" stroke={GINGER} strokeWidth="2.5" />
    </svg>
  );
}

function SteamSvg() {
  return (
    <svg viewBox="0 0 120 230" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 224 C10 184 52 150 32 108 C14 70 46 38 34 4" stroke={CREAM} strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 218 C48 182 84 148 66 110 C50 74 80 44 70 14" stroke={CREAM} strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <path d="M98 210 C84 180 112 152 98 118 C86 88 108 62 100 34" stroke={CREAM} strokeOpacity="0.28" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function NorenSvg() {
  return (
    <svg viewBox="0 0 150 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5 H148" stroke={CREAM} strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="8" y="10" width="29" height="70" rx="3" fill={RED} fillOpacity="0.94" />
      <rect x="45" y="10" width="29" height="60" rx="3" fill={RED} fillOpacity="0.86" />
      <rect x="82" y="10" width="29" height="74" rx="3" fill={RED} fillOpacity="0.94" />
      <rect x="119" y="10" width="29" height="56" rx="3" fill={RED} fillOpacity="0.82" />
    </svg>
  );
}

function NoodleSvg() {
  return (
    <svg viewBox="0 0 380 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0, 30, 60, 90].map((dy, i) => (
        <path
          key={dy}
          d={`M0 ${24 + dy} C 60 ${4 + dy} 120 ${44 + dy} 190 ${24 + dy} S 320 ${4 + dy} 380 ${24 + dy}`}
          stroke={GINGER}
          strokeOpacity={0.5 - i * 0.09}
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
