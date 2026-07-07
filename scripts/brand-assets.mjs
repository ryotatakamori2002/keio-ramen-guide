// ブランドアセット（favicon PNG / apple-icon / OG画像）を Playwright で描画して生成する。
// 使い方: node scripts/brand-assets.mjs
// - app/icon.svg（ベクタ favicon）は手書きのSVGで、この図形と同一にしておく。
// - OG画像は本番Heroと同じ「実写真が主役」で組む（維新商店 hero.jpg）。
import { readFileSync } from "fs";
import { chromium } from "playwright";

const RED = "#c53024";
const DARK = "#11100e";
const CREAM = "#f7f1e8";
const CREAM_MUTED = "#cfc6b8";

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
    <div style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;border:3px solid ${CREAM};background:${DARK}">
      ${campus ? `<div style="width:7px;height:7px;border-radius:50%;background:${RED}"></div>` : ""}
    </div>
    <div style="font-size:19px;font-weight:600;color:${CREAM};white-space:nowrap">${name}</div>
  </div>`;

// 本番Heroと同じ構図：左が暗色パネル（ロゴ・コピー・沿線）、右が維新商店の実写真。
const heroJpg = readFileSync("public/images/shops/yokohama-ishinshoten/hero.jpg").toString("base64");
const og = `
<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:${DARK}; color:${CREAM};
         font-family:"Hiragino Sans","Hiragino Kaku Gothic ProN",sans-serif;
         position:relative; overflow:hidden; border-bottom:10px solid ${RED}; }
</style></head><body>
  <!-- 写真（右55%） -->
  <img src="data:image/jpeg;base64,${heroJpg}"
       style="position:absolute;top:0;right:0;width:62%;height:100%;object-fit:cover;object-position:30% 55%"/>
  <div style="position:absolute;top:0;right:0;width:62%;height:100%;
              background:linear-gradient(to right, ${DARK} 0%, rgba(17,16,14,0) 34%)"></div>
  <div style="position:absolute;bottom:0;right:0;width:62%;height:45%;
              background:linear-gradient(to top, rgba(17,16,14,.85), rgba(17,16,14,0))"></div>
  <!-- 写真キャプション -->
  <div style="position:absolute;right:40px;bottom:34px;text-align:right">
    <div style="font-size:15px;color:${CREAM_MUTED};letter-spacing:.1em">今日の一杯</div>
    <div style="font-size:22px;font-weight:700;margin-top:6px">横浜中華そば 維新商店</div>
  </div>
  <!-- 左パネル -->
  <div style="position:absolute;left:0;top:0;bottom:0;width:47%;
              display:flex;flex-direction:column;justify-content:space-between;
              padding:56px 24px 46px 64px">
    <div style="display:flex;align-items:center;gap:16px">
      <div style="width:50px;height:50px">${mark(12)}</div>
      <div>
        <div style="font-size:25px;font-weight:700;letter-spacing:-0.01em">Keio Ramen Guide</div>
        <div style="font-size:14px;color:${CREAM_MUTED};margin-top:5px;letter-spacing:0.12em">慶應生のためのラーメンガイド</div>
      </div>
    </div>
    <div style="font-size:54px;font-weight:800;line-height:1.34;letter-spacing:-0.015em">
      店選びは、<br>食べた人の<br>一言から。
    </div>
    <div>
      <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start;max-width:440px">
        <div style="position:absolute;top:9px;left:60px;right:60px;height:2.5px;background:${CREAM}"></div>
        ${station("三田・田町", true)}
        ${station("日吉", true)}
        ${station("横浜", false)}
      </div>
      <div style="margin-top:16px;font-size:14px;color:${CREAM_MUTED};letter-spacing:0.06em">日吉・三田・横浜 ｜ 実際に食べた慶應生の投稿で選ぶ</div>
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
