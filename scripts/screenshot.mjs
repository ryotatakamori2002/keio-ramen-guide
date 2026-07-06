// ページのスクリーンショットを一括保存する開発用スクリプト。
// 使い方: node scripts/screenshot.mjs <outDir> [baseUrl]
// whileInView系のモーションで下部セクションが写らないのを避けるため、
// prefers-reduced-motion: reduce でレンダリングする。
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const outDir = process.argv[2] ?? "docs/screenshots/tmp";
const baseUrl = process.argv[3] ?? "http://localhost:3000";

const SHOTS = [
  { name: "home", url: "/", widths: [390, 1280] },
  { name: "home-hero", url: "/", widths: [390, 1280], fullPage: false },
  { name: "shops", url: "/shops", widths: [390, 1280] },
  { name: "post", url: "/post", widths: [390, 1280] },
  { name: "shop-detail", url: "/shops/hiyoshi-musashiya", widths: [390, 1280] },
  { name: "quiz", url: "/quiz", widths: [390] },
  { name: "results", url: "/results?location=hiyoshi&scene=after_class&taste=iekei&richness=rich&queue=fifteen_ok", widths: [390] },
  { name: "saved", url: "/saved", widths: [390] },
];

const HEIGHTS = { 390: 844, 1280: 900 };

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const shot of SHOTS) {
  for (const width of shot.widths) {
    const ctx = await browser.newContext({
      viewport: { width, height: HEIGHTS[width] },
      reducedMotion: "reduce",
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(baseUrl + shot.url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(600);
    const file = path.join(outDir, `${shot.name}-${width}.png`);
    await page.screenshot({ path: file, fullPage: shot.fullPage !== false });
    console.log("saved", file);
    await ctx.close();
  }
}

await browser.close();
