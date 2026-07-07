// ブランドアセット（favicon PNG / apple-icon / OG画像）を Playwright で描画して生成する。
// 使い方: node scripts/brand-assets.mjs
// - app/icon.svg（ベクタ favicon）は手書きのSVGで、この図形と同一にしておく。
// - OG画像はダークHeroの世界観（夜の店先＋沿線図）を踏襲する。
import { chromium } from "playwright";

const RED = "#c53024";
const DARK = "#11100e";
const CREAM = "#f7f1e8";
const CREAM_MUTED = "#cfc6b8";
const GINGER = "#c88a32";

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

// 夜の店先（ダークHero）を共有カードに。暖簾の赤・生姜ゴールドの丼の縁・湯気。
const og = `
<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:${DARK}; color:${CREAM};
         font-family:"Hiragino Sans","Hiragino Kaku Gothic ProN",sans-serif;
         display:flex; flex-direction:column; justify-content:space-between;
         padding:60px 72px 52px; position:relative; overflow:hidden;
         border-bottom:10px solid ${RED}; }
</style></head><body>
  <!-- 暖簾（右上） -->
  <div style="position:absolute;top:0;right:96px;display:flex;gap:8px">
    <div style="width:30px;height:74px;background:${RED};border-radius:0 0 4px 4px"></div>
    <div style="width:30px;height:62px;background:${RED};opacity:.85;border-radius:0 0 4px 4px"></div>
    <div style="width:30px;height:78px;background:${RED};border-radius:0 0 4px 4px"></div>
    <div style="width:30px;height:58px;background:${RED};opacity:.8;border-radius:0 0 4px 4px"></div>
  </div>
  <!-- 丼の縁（左下に断ち落とし） -->
  <svg viewBox="0 0 520 400" style="position:absolute;left:-120px;bottom:-250px;width:520px;opacity:.85" xmlns="http://www.w3.org/2000/svg" fill="none">
    <ellipse cx="260" cy="118" rx="226" ry="62" stroke="${GINGER}" stroke-width="3"/>
    <ellipse cx="260" cy="118" rx="168" ry="44" stroke="${CREAM}" stroke-opacity="0.4" stroke-width="2"/>
    <path d="M140 116 Q 200 84 262 102 Q 320 118 366 96" stroke="${CREAM}" stroke-opacity="0.55" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="318" cy="108" r="17" fill="${CREAM}" fill-opacity="0.92"/>
    <path d="M318 97 a11 11 0 1 1 -10 14 a7.5 7.5 0 1 0 7 -10 a4 4 0 1 0 3 6" stroke="${RED}" stroke-width="2.2" stroke-linecap="round"/>
  </svg>
  <!-- 湯気（左上） -->
  <svg viewBox="0 0 120 230" style="position:absolute;left:130px;top:28px;width:74px;opacity:.5" xmlns="http://www.w3.org/2000/svg" fill="none">
    <path d="M32 224 C10 184 52 150 32 108 C14 70 46 38 34 4" stroke="${CREAM}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M66 218 C48 182 84 148 66 110 C50 74 80 44 70 14" stroke="${CREAM}" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round"/>
  </svg>

  <div style="position:relative;display:flex;align-items:center;gap:18px">
    <div style="width:52px;height:52px">${mark(12)}</div>
    <div>
      <div style="font-size:27px;font-weight:700;letter-spacing:-0.01em">Keio Ramen Guide</div>
      <div style="font-size:15px;color:${CREAM_MUTED};margin-top:5px;letter-spacing:0.12em">慶應生のためのラーメンガイド</div>
    </div>
  </div>
  <div style="position:relative;font-size:66px;font-weight:800;line-height:1.32;letter-spacing:-0.015em;text-align:right">
    店選びは、<br>食べた人の一言から。
  </div>
  <div style="position:relative;margin-left:210px">
    <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start">
      <div style="position:absolute;top:9px;left:75px;right:75px;height:2.5px;background:${CREAM}"></div>
      ${station("三田・田町", true)}
      ${station("日吉", true)}
      ${station("横浜", false)}
    </div>
    <div style="margin-top:20px;padding-top:16px;border-top:1.5px solid rgba(247,241,232,.25);display:flex;justify-content:space-between;font-size:15px;color:${CREAM_MUTED}">
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
