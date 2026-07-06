// ブランドアセット（favicon PNG / apple-icon / OG画像）を Playwright で描画して生成する。
// 使い方: node scripts/brand-assets.mjs
// - app/icon.svg（ベクタ favicon）は手書きのSVGで、この図形と同一にしておく。
// - OG画像はトップの沿線図モチーフを踏襲する。
import { chromium } from "playwright";

const RED = "#b23a2e";
const BG = "#fbfaf7";
const FG = "#181511";
const MUTED = "#706a60";
const BORDER = "#e9e4db";

// BrandMark と同じ図形（丼＋箸）。rx はアイコン種別ごとに変える。
const mark = (rx) => `
  <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="${rx}" fill="${RED}" />
    <path d="M18 46h64a32 32 0 0 1-64 0z" fill="#fff" />
    <rect x="40" y="81" width="20" height="6" rx="2" fill="#fff" />
    <path d="M16 34 84 17" stroke="#fff" stroke-width="5" stroke-linecap="round" />
    <path d="M18 43 86 26" stroke="#fff" stroke-width="5" stroke-linecap="round" />
  </svg>`;

const station = (name, campus) => `
  <div style="position:relative;display:flex;flex-direction:column;align-items:center;gap:14px;width:150px">
    <div style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;border:3px solid ${FG};background:${BG}">
      ${campus ? `<div style="width:7px;height:7px;border-radius:50%;background:${RED}"></div>` : ""}
    </div>
    <div style="font-size:19px;font-weight:600;color:${FG};white-space:nowrap">${name}</div>
  </div>`;

const og = `
<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:${BG}; color:${FG};
         font-family:"Hiragino Sans","Hiragino Kaku Gothic ProN",sans-serif;
         display:flex; flex-direction:column; justify-content:space-between;
         padding:64px 72px 56px; border-bottom:10px solid ${RED}; }
</style></head><body>
  <div style="display:flex;align-items:center;gap:18px">
    <div style="width:52px;height:52px">${mark(12)}</div>
    <div>
      <div style="font-size:27px;font-weight:700;letter-spacing:-0.01em">Keio Ramen Guide</div>
      <div style="font-size:15px;color:${MUTED};margin-top:5px;letter-spacing:0.12em">慶應生のためのラーメンガイド</div>
    </div>
  </div>
  <div style="font-size:66px;font-weight:800;line-height:1.32;letter-spacing:-0.015em">
    店選びは、<br>食べた人の一言から。
  </div>
  <div>
    <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start">
      <div style="position:absolute;top:9px;left:75px;right:75px;height:2.5px;background:${FG}"></div>
      ${station("三田・田町", true)}
      ${station("日吉", true)}
      ${station("横浜", false)}
    </div>
    <div style="margin-top:22px;padding-top:18px;border-top:1.5px solid ${BORDER};display:flex;justify-content:space-between;font-size:15px;color:${MUTED}">
      <span>実際に食べた慶應生の投稿と、価格の目安で選べます。</span>
      <span style="letter-spacing:0.08em">日吉・三田・横浜</span>
    </div>
  </div>
</body></html>`;

const iconPage = (size, rx) => `
<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0;padding:0}</style></head>
<body style="width:${size}px;height:${size}px">${mark(rx)}</body></html>`;

const browser = await chromium.launch();

async function shoot(html, width, height, path, scale = 1) {
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(150);
  await page.screenshot({ path });
  await ctx.close();
  console.log("saved", path);
}

await shoot(og, 1200, 630, "app/opengraph-image.png");
await shoot(iconPage(64, 18), 64, 64, "app/icon.png");
// Appleはマスクを自前でかけるので角丸なし・全面塗り
await shoot(iconPage(180, 0), 180, 180, "app/apple-icon.png");

await browser.close();
