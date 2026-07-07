# autonomous-quality-pass-v1 作業ログ

作業日: 2026-07-07（自律作業・約7時間）
ブランチ: `autonomous-quality-pass-v1`（main から分岐）

## 前提整理（開始時の状態）

- 前セッションの未コミット差分は「アカウント＋マイログ機能」のWIPだった。
  lint/buildは通る状態だったが、**本番Supabaseへの移行（profilesテーブル・ramen_postsの新カラム）と認証設定が未適用のままmainへ出すと、本番の投稿表示と投稿機能が壊れる**（存在しないカラムを参照して全投稿が空になる／投稿がログイン必須になる）。
  → `account-ramen-log-v1` ブランチに保全コミット（b80e331）し、今回の品質パスには含めない。
- main はビルド成功。ここから `autonomous-quality-pass-v1` を作成。

## 1. 現在のサイトで最も弱いと判断した点

スクリーンショット（visual-polish-v3）とコード全読の結果、順に：

1. **共有した瞬間に破綻する**: faviconがNext.jsデフォルト、OG画像なし、metadataBaseが`example.com`のプレースホルダ。LINEで送ると「Next.jsの三角アイコン＋画像なしカード」になる。「友達に送れるか」という完了基準を入口で満たしていない。
2. **主役ビジュアルの不在**: 全29店舗が写真ゼロ（`primaryImageUrl`未設定）。Heroはテキスト＋ボタンのみで、デスクトップでは右半分が空白。サイト全体が「クリーム地に白い角丸カードの縦積み」で、AIテンプレの典型形になっている。
3. **「No photo yet」の29連発**: 店カードのサムネが全店同一のグレー箱＋英語ラベル。未完成感の最大の発生源。
4. **意味の薄い英語見出しの乱発**: AREA INDEX / RECENT LOGS / CURATED / DECISION NOTES / KEIO USE CASE / RESULTS / SAVED…。「それっぽい英語」というAI slopパターンそのもの。しかも投稿・気分ページは日本語eyebrowで不統一。
5. **/postが「フォーム」のまま**: 最上部に巨大な空のドロップゾーン（py-12）、店舗選択が巨大なネイティブselect（禁止事項に該当）。投稿したくなる空気がない。
6. **ギミック系モーション**: Hero CTAのMagneticButton（カーソル吸着）と画面上部のPageProgressバー。上品さより「AIが入れがちな演出」に寄っている。
7. 細部: 店舗詳細でSaveButtonsが上下2回出る／モバイルで窮屈な5列メトリクス／savedの初回が破線空箱2連／404が英語見出し。

## 2. 今回7時間で最も効果が高いと判断した改善方針

**「写真がなくても成立するビジュアルアイデンティティを作り、入口（Hero・共有カード・一覧サムネ）を刷新する」**

核になるアイデア＝**沿線図（route diagram）**。
三田・日吉・横浜は実際に1本の鉄道軸で結ばれている（都営三田線→東急目黒線直通で三田⇄日吉、東急東横線で日吉⇄横浜）。慶應生の生活導線そのものであり、このサイトの情報構造（3エリア）と完全に一致する。これをミニマルな路線図SVGとしてHeroの主役に据える。

- 写真ゼロでも成立する・タップでエリアへ飛べる（情報がビジュアルに統合）
- 「授業のあるキャンパスの沿線で選ぶ」というサービスの差別化を3秒で伝える
- 白黒＋赤1点・細線・駅ドットのみ。3Dや過剰アニメは使わない（線が一度だけ引かれるdraw-inのみ）

優先順位：

1. **P1 共有体験**: favicon（SVG）/ apple-icon / OG画像（1200×630）/ metadataBase修正
2. **P2 Hero＋トップ再構成**: 沿線図コンポーネント、コピー刷新、エリアカード3枚→沿線図に統合、棚4連→密度の高い編集リスト化
3. **P3 写真なし状態**: 「No photo yet」廃止 → 縦書きジャンル文字の静かなタイル（全店で見た目が変わる）
4. **P4 /post**: 巨大select→検索式の店舗選択、フィールド順序の再設計、投稿例の見えるトーン
5. **P5 /shops**: エリア見出しでリストに構造を与える、フィルタ周りの密度調整
6. **P6 コピー全面パス**: 英語eyebrowの日本語化、404、admin文言、不自然表現の除去
7. **P7 モーション整理**: MagneticButton・PageProgress削除、1セクション1エフェクトに統一

## 3. 今回あえてやらないこと

- アカウント/ログイン/マイログ（`account-ramen-log-v1`に保全済み。本番DB移行が必要で、不在時間中に本番へ出すのは危険）
- 店舗データの増減・実在確認のやり直し（前回パスで確認済み。29店の事実情報は維持）
- 地図API・外部埋め込み（コスト・鍵管理が発生する）
- ダークモード
- 投稿へのいいね等の新機能

## 4. 技術的に壊してはいけないもの

- `isSupabaseReady()` ガード（未設定でもbuild・表示が通る）
- 投稿の承認制（pending→approved、service role経由の書き込み、RLS）
- `/shops` `/post` `/quiz` `/results` `/saved` `/admin` の全ルート
- `ResolvedShelf`のシリアライズ境界（match関数をclientに渡さない）
- localStorage保存（`keio-ramen-guide:want-to-go` / `:visited`）
- ISR（`revalidate = 60`）と `/admin` の force-dynamic
- service role keyをクライアントに出さない

## 5. デザイン面で守る基準

- 白黒ベース・赤は1画面に1〜2箇所まで（リンク・現在地ドット）
- 黒ボタン主役、罫線中心、影なし〜最小
- 角丸は `rounded-md` / `rounded-lg` まで（乱発しない）
- 余白を広げて誤魔化さない。情報密度を保つ（店数・価格・駅名を消さない）
- `text-wrap: balance` / `break-keep` を見出しに
- モーションは FadeIn系の入場と沿線図のdraw-inのみ。ホバーは色/罫線変化中心

## 6. コピー面で守る基準

- 禁止リスト（実食ログで。/今日どこ啜る？/外さない一杯/腹パン/麺活/君の物語/ドラマチック/一杯を、記録する。/エモい 等）を使わない
- 絵文字なし・俗語なし・ポエムなし
- 見出しは「何ができるか」を言う（例: 店を探す / 投稿する / 記録を追加する）
- 英語は「Keio Ramen Guide」のブランド名のみ。セクション見出しの飾り英語は使わない
- 事実に基づく表現のみ（価格は目安、乗車時間は「約」を付ける）

## 7. 最終的にどうなれば成功か

- LINEで送ったときに専用のOGカードとfaviconが出る
- スマホで開いた3秒で「日吉・三田・横浜のラーメンを慶應生の投稿で選ぶサイト」と分かる
- Heroに触りたくなる要素（沿線図→エリアへ）がある
- 一覧で29店のサムネが同一のグレー箱に見えない
- /postが1画面で迷わず書き切れる
- 英語見出し・No photo yet・巨大selectが消えている
- lint/build成功、全ルート表示確認、main merge & push、Vercel反映

---

## 進捗ログ

- [x] 現状把握（git/lint/build/コード全読/過去スクショ確認）
- [x] WIP保全コミット → account-ramen-log-v1
- [x] 診断・方針策定（本ドキュメント）
- [x] before スクリーンショット（docs/screenshots/autonomous-quality-pass-v1/before/）
- [x] P1 共有体験（icon.svg/icon.png/apple-icon/OG画像/metadataBase修正/デフォルトfavicon削除）
- [x] P2 Hero＋トップ（AreaLineMap沿線図、編集棚リスト2本＋シーンリンク、CTA整理）
- [x] P3 写真なし状態（縦書きジャンルタイル。「No photo yet」全廃）
- [x] P4 /post（検索式ShopSelect、フィールド順再設計、コンパクトな写真欄）
- [x] P5 /shops（エリア見出しグルーピング、棚の重複削除、末尾に静かな投稿導線）
- [x] P6 コピー（英語eyebrow全廃・404日本語化・前後/目安の二重表現解消・腹パン等の俗語除去・混雑ラベル）
- [x] P7 モーション整理（MagneticButton/PageProgress削除、MotionConfigでreduced-motionのハイドレーションバグ修正）
- [x] 自己レビュー3回＋修正（下記）
- [x] 最終スクショ（本番ビルドで撮影）・全ルートQA
- [x] README/配布文面の古い記述更新（写真募集中・どこ啜る？・PhotoCallout・リモート手順）
- [ ] merge・push・Vercel確認

## 自己レビュー結果

### Review 1: First Impression
- 3秒理解: 「慶應生のためのラーメンガイド」eyebrow＋タイトル＋沿線図で成立 → OK
- Heroの弱さ: 沿線図（AreaLineMap）が主役として機能。写真ゼロでも空白がない → OK
- 発見して修正した問題:
  - ブランドマーク追加でモバイルヘッダーのnavがはみ出す → navを3項目に（気分で選ぶはHero//shopsの導線に残す）
  - 特集2棚（授業後×初めての家系）で店が重複 → キャンパス対比ペア（授業後の日吉で×三田の昼に）へ変更し重複ゼロ
  - 五輪洞の行が「つけ麺・つけ麺」 → ジャンルと初回注文が同一文字列の時は重複させない
  - 赤の過多 → 「すべての店」リンクとカード内「投稿」リンクをmutedに（赤はブランドマーク・campusドット・主要CTA程度に）
  - 投稿セクションのCTA重複 → 投稿0件時はヘッダー側アクションを非表示

### Review 2: Mobile（390px）
- First View: コピー＋CTA＋沿線図カードの上端まで入り、スクロール誘発 → OK
- /shops: 全長24,344px→18,622px。エリア見出し（日吉8/三田9/横浜10）で現在地が分かる → OK
- /post: 選択済み店舗はチップ表示に畳まれ、写真欄はコンパクト。1画面で書き切れる → OK
- 発見して修正した問題:
  - PriceNoteの「¥950前後＋目安」の二重表現が狭幅で改行落ち → 「前後」のみに統一
  - 詳細ページでPriceNote直下のexpectedSpendNoteが価格を繰り返す → 表示時に先頭の「¥xxx前後。」を除去
  - 詳細の5列メトリクスグリッドが窮屈 → 罫線行のインライン表示＋/5表記へ

### Review 3: AI Slop
- 英語eyebrow（AREA INDEX / RECENT LOGS / CURATED / DECISION NOTES / RESULTS / SAVED等）全廃。
  残る英語はブランド名・駅名標式のローマ字（MITA等）・NO.表記のみ＝意図的なもの
- 「No photo yet」全廃（縦書きジャンルタイルへ）。フィルタの「All」→「すべて」
- lib/shops.ts寸評の「腹パン」「外さない/外したくない」を自分の言葉で書き直し
- MagneticButton（カーソル吸着）・PageProgress（上部バー）削除。未使用のsectionLabelトークン削除
- メトリクス「並び」の極性が誤読される（大きいほど並ぶのに良い値に見える）→「混雑」に改名
- 反復チェック: 「まだ投稿はありません。」がトップ/詳細の2文脈で同文 → 文脈が違うため許容

## 最終QA結果

- `npm run lint`: エラーなし
- `npm run build`: 成功（41ルート生成、icon/apple-icon/opengraph-image含む）
- 本番ビルド（next start）での全ルート確認:
  / /shops /post /quiz /results(パラメータ有無両方) /saved
  /shops/hiyoshi-musashiya /shops/yokohama-yoshimuraya /shops/mita-jiro /admin
  /icon.svg /icon.png /apple-icon.png /opengraph-image.png → すべて200、存在しないURL → 404
- OG/iconのheadタグ出力確認（og:image / twitter:card=summary_large_image / icon.svg+png / apple-touch-icon）
- 既知の実バグ修正: reduced-motion設定ユーザーで全ページのハイドレーションが壊れる問題
  （motionコンポーネントのDOM切替をMotionConfigに一元化して解消）

## 残課題（次にやるべきこと）

- 投稿が実際に並んだ状態のトップ/詳細の見え方確認（現状は投稿0件想定のレイアウト）
- アカウント/マイログ機能: `account-ramen-log-v1` ブランチに保全済み。
  本番Supabaseへ `supabase/schema.sql` の冪等マイグレーション適用＋Auth設定をしてからマージすること
- 写真収集（撮影・許諾）と `primaryImageUrl` の設定開始
- 沿線図の所要時間（急行約15分）は概数。ダイヤ改定時に見直し
- OG画像は静的1枚。店舗ごとのOG画像は未対応（必要なら next/og で動的生成に切替）

### 実装メモ

- reduced-motion時に全ページでハイドレーションが壊れる実バグを発見・修正
  （useReducedMotionでDOM構造を切り替えていた → MotionConfig reducedMotion="user"に一元化）
- ヘッダーnavからは「気分で選ぶ」を外し3項目に（モバイル幅対策。導線はHero・/shopsに残存）
- 特集棚はキャンパス対比の2本（授業後の日吉で／三田の昼休み）にして店の重複ゼロ
- lib/shops.tsの寸評から「腹パン」「外さない」系の表現を自分の言葉で書き直し（事実情報は不変更）
