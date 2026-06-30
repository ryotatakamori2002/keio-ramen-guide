# Keio Ramen Guide

授業終わり、どこ啜る？ — 日吉・三田・横浜の、慶應生が今日の一杯を外さないためのラーメン案内。

> **現在は「慶應生10人検証用MVP」です。** 広く一般公開する完成版ではなく、まず身内で「使えるか・どの店が足りないか・見づらい所はないか」を検証する段階。
> **全店舗の写真は未収集**（全店「写真募集中」）。写真は無断転載せず、自分で撮影した／掲載許可を得たものだけを載せます。
> 価格・営業時間・学生サービスは変動します。`dataConfidence: "low"` や `publishStatus: "needs_review"` の店は実在・営業・価格が未確認の項目を含むため、公開前に各店の最新情報を確認してください。

## サービスの目的

慶應生が「今いる場所」と「今日の気分・生活シーン」から、**今日行くラーメン屋を早く・失敗せず決められる**ことだけに集中したミニサイト。全国網羅・点数・ランキングでは勝負しない。広告なし・軽量・スマホファースト・生活シーン特化で、ラーメンDBやGoogle Mapsとは違う「局所的な使いやすさ」で勝つ。

さらに、**慶應生の実食ログ（写真・価格・一言）で育つ**設計。固定データだけでなく、食べた人の投稿で店舗ページに「人が食べた感」を足していく。

対象エリア：日吉 / 三田・田町 / 横浜駅周辺。

## 投稿機能（実食ログ）

- `/post`：ログインなしで投稿（ニックネーム任意・画像1枚・メニュー名・金額・一言・シーン）。投稿は **`pending` で保存**され、すぐには公開されない。
- `/admin`：`ADMIN_PASSWORD` による簡易認証の承認画面。承認すると `approved`、却下で `rejected`。`approved` の投稿だけが店舗詳細・トップ・/shops に表示される（荒らし防止）。
- 投稿の編集・削除は管理者のみ。いいね/フォロー/コメントはMVPでは作らない。
- **Supabase が未設定でもローカル開発・build は壊れない。** 投稿系の読み取りは空配列を返し、`/post` は「Supabase設定後に投稿機能が有効になります」と表示する。

### Supabase セットアップ手順

1. [Supabase](https://supabase.com) でプロジェクトを作成。
2. **スキーマ適用**：ダッシュボードの「SQL Editor」で [`supabase/schema.sql`](supabase/schema.sql) を貼り付けて Run（`ramen_shops` / `ramen_posts` テーブル、RLS、`ramen-post-images` バケットを作成）。
3. **Storage バケット**：schema.sql でバケット作成・公開読み取りポリシーまで設定される。手動で作る場合は Storage で `ramen-post-images`（public）を作成。画像は `posts/{uuid}.jpg` に保存される。
4. **環境変数**：`.env.example` をコピーして `.env.local` を作り、以下を設定。
   - `NEXT_PUBLIC_SUPABASE_URL` … プロジェクト URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` … anon キー
   - `SUPABASE_SERVICE_ROLE_KEY` … service role キー（サーバー専用・絶対に公開しない）
   - `ADMIN_PASSWORD` … `/admin` に入る共有パスワード
5. `npm run dev` で `/post` から投稿 → `/admin` でログイン → 承認 → 店舗詳細に表示、を確認。

### 投稿承認フロー

`/post` で投稿（`pending`）→ `/admin` でパスワードログイン → 写真・店・メニュー・価格・コメントを確認 → 「承認」で `approved`（公開）／「却下」で `rejected`（非公開）。承認済みは最大60秒（ISR）で各ページに反映。

### 写真の権利ルール

- 掲載してよいのは **自分で撮った写真**、または **本人/店舗の掲載許可を得た写真** だけ。
- 他サイト・SNSの写真の無断転載は禁止。投稿時にもこの旨を明示している。
- 画像は service role 経由でのみアップロードされ、バケットは公開読み取り（URLは推測困難なUUID）。却下した投稿の画像は手動で削除すること。

## Deep Researchから得た学び

- ユーザーが本当に求めているのは綺麗なUIではなく、**失敗しない店選び**：初回注文・価格目安・並び・一人で入れるか・初心者でも怖くないか・営業情報の信頼性・行った/行きたいの記録。
- 既存サービスへの不満：広告が多い、UIが古くごちゃつく、スマホで使いづらい、点数の信頼性が不明、写真や営業情報が古い、自分の生活シーンに合うか分からない、初回の注文ルールが分からない。
- 勝ち筋は全国網羅ではなく「生活シーン別の店選び」：日吉で授業後 / 三田で昼休み / 横浜で帰り道 / 空きコマ / 一人飯 / 飲み後 / 腹パン / 初めての家系 / 二郎系初心者 / 並びたくない日。
- だから本サイトは「店舗一覧」ではなく、**今日の一杯を決める意思決定ツール**として作る。

## MVPのMust機能

- 店舗一覧（`/shops`）と店舗詳細（`/shops/[id]`）。一覧は「決める画面」として、カードだけで判断材料が揃う。
- 写真対応のデータ構造（`images` / `primaryImageUrl` / `photoStatus` / `photoNeeded`）と、**写真がない時のUI（巨大な偽イラストを出さず「写真募集中」と明示）**。
- 初回おすすめ注文（`firstVisitOrder`）＋価格目安（`firstVisitPrice` / `expectedSpendNote`、すべて「目安」）。
- 用途別ベスト棚（`lib/shelves.ts`、編集された棚）。
- エリア / ジャンル / シーン別検索、一人飯・飲み後・腹パン・初心者・並び少なめの絞り込み。
- 行きたい / 行った保存（localStorage）。
- Google Mapsリンク。
- データ信頼性表示（最終確認日・信頼度・注意書き）。
- 5問の気分診断（サブ導線）。

技術：Next.js (App Router) / TypeScript / Tailwind CSS。DB・認証・投稿・スクレイピング・AIレコメンドなし。

## 写真運用ルール（重要）

無断転載は禁止。掲載してよいのは次のいずれかで、**必ず `permissionConfirmed: true` と `credit` を記録**する。

1. **自分で撮った写真のみOK**（`sourceType: "owned"`）。
2. **友達提供写真**は、本人の掲載許可を得た場合のみOK（`sourceType: "friend_provided"`、許可を記録）。
3. **店舗公式写真**は、店舗の許諾を得た場合のみOK（`sourceType: "official_permission"`）。
4. 他サイト・SNSの写真の無断使用は禁止。レビュー文・紹介文のコピーも禁止。

写真がない店は `photoStatus: "none"` / `photoNeeded: true` のままにし、UIでは「写真募集中」と小さく表示する。許諾済み写真ができたら `images` に追加し `primaryImageUrl` を設定すると、一覧・詳細・棚に自動反映される。

### 友達に写真提供を依頼する文面（例）

> ラーメンの写真を慶應生向けのミニサイトに載せたくて、もしお店で撮った写真があれば貸してくれない？ サイトに「撮影：〇〇」とクレジットを入れます。載せてOKな写真だけ送ってくれたら助かる！

### 店舗に写真使用許可を取る文面（例）

> 突然のご連絡失礼します。慶應生向けに日吉・三田・横浜のラーメン店を紹介する非営利のサイトを作っています。広告なし・店舗情報は事実ベースで掲載しています。差し支えなければ、貴店のメニュー写真を出典明記の上で掲載させていただけないでしょうか。掲載イメージは事前に共有します。

## 公開ステータス（publishStatus）と編集優先度

各店に `publishStatus` と `editorialPriority`、`dataConfidence` を持たせ、信頼できる店だけが前面に出るようにしている。

| publishStatus | 意味 | トップ/棚/診断 | /shops |
| --- | --- | --- | --- |
| `ready` | 本公開候補。実在・概況を確認済み | 出す（high/medium・must/should を優先） | 出す |
| `needs_review` | 掲載はするが要確認の項目あり | 用途別棚には出さない | 出す（「要確認」ラベル付き） |
| `candidate` | 調査候補。未確認 | 出さない | 初期非表示。「調査候補も含める」ONで表示 |

- 用途別ベスト棚に出る条件：`ready` かつ `dataConfidence` が high/medium かつ `editorialPriority` が must/should かつ selectionReason / firstVisitOrder / expectedSpendNote / Google Maps URL が揃っている。
- 診断結果（/results）は `candidate` を除外し、high を優先・`low` と `needs_review` は上位に出ないよう減点。
- 一覧・詳細では `dataConfidence: "low"` または `needs_review` の店に「要確認」ラベルを出し、詳細では「公開前に要確認」バナーを表示。

現在の内訳（2026-06 時点）：ready 23（日吉8 / 三田7 / 横浜8）、needs_review 4、candidate 2。

## データ更新ルール

- 事実情報（店名・最寄駅・ジャンル・地図リンク・公式URL・価格の目安・深夜営業の有無・アクセス）のみ公開情報から利用する。
- レビュー文・口コミ・紹介文・写真はコピーしない。コメント類（`selectionReason` / `avoidIf` / `keioUseCase` / 各 advice / `tasteNotes` など）はすべて自分の言葉で書く。
- 価格は断定しない。`firstVisitPrice` は目安、`priceConfidence: "approximate"`、UIに「目安／前後」を出す。
- 営業時間・定休日・閉店は断定しない。閉店情報が出た店は載せない（例：天下一品 田町店は閉店のため不掲載）。
- 各店に `dataLastChecked`（最終確認年月）と `dataConfidence`（high/medium/low）と `dataNote` を持たせる。実在・営業状況・価格が不確かな店は `low` にし、強く推さない。
- 横浜駅から遠い店は「横浜駅周辺」と断定しない。含める場合は別途「横浜エリア拡張候補」として扱う。

## 店舗情報の注意点

- 掲載は MVP 時点の調査ベース。価格・営業時間・並び・学生サービス（大盛無料など）は変動する。
- `dataConfidence: "low"` の店は実在・営業・詳細が未確認の項目を含む。訪問前に Google Maps や公式で確認すること。
- 写真は現状すべて未掲載（プレースホルダー＝写真募集中）。

## 公開前チェックリスト

- [ ] `npm run lint` / `npm run build` が通る
- [ ] 主要ページ（/ /shops /shops/[id] /quiz /results /saved）が表示される
- [ ] 全店の詳細ページが開ける
- [ ] localStorage の行きたい/行った保存が動く
- [ ] スマホ幅・PC幅で崩れない
- [ ] 各店の価格・営業の断定表現がない（「目安」明記）
- [ ] `dataConfidence: low` の店を強く推していない
- [ ] 無断転載の写真・コピー文章がない
- [ ] favicon / OGP が設定されている

身内検証時に送る配布文面は [docs/test-message.md](docs/test-message.md) を参照。

## 慶應生10人へのヒアリング質問

1. 普段、ラーメン屋はどうやって決めている？（アプリ / 口コミ / なんとなく）
2. 日吉・三田・横浜で「今日どこ行く」を決める時に一番困ることは？
3. このサイトのトップを見て、3秒で何のサイトか分かった？
4. 店舗カードだけで「今日行くか」を判断できた？ 足りない情報は？
5. 初めての店で不安なこと（注文方法 / 並び / 一人で入れるか）は解消された？
6. 価格の「目安」表示は信頼できる？ 数字は欲しい？ 範囲で十分？
7. 用途別ベスト棚（一人飯・腹パン等）は使いたいと思った？
8. 写真がない店の「写真募集中」表示はどう感じた？
9. このサイトを友達にLINEで送る？ 送るなら誰に・どの店？
10. 次に行きたい店が決まった？ 決まらなかったとしたら理由は？

## 30日KPI

- 友達への共有数（LINE等で送られた回数）
- 訪問ユーザーのうち「行きたい」を1件以上保存した割合
- 1セッションあたりの店舗詳細閲覧数
- 診断 → 結果 → 詳細の到達率
- 再訪率（同一ブラウザの7日以内再訪）
- ヒアリングで「次に行く店が決まった」と答えた割合

## 継続 / 撤退判断基準

- **継続**：30日でヒアリング対象の半数以上が「次に行く店が決まる」「友達に送れる」と答え、保存や再訪が一定数生まれる。
- **方向転換**：使われるがエリア/シーンの形が想定と違う → 棚や対象エリアを組み替える。
- **撤退**：共有も保存もほとんど起きず、ヒアリングでも「ラーメンDBやGoogle Mapsで十分」が大勢 → MVPを畳む。

## Getting Started

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開く。

```bash
npm run lint
npm run build
```

スクリーンショットは [docs/screenshots/](docs/screenshots/) に保存（Playwright で生成）。

## GitHub / Vercel 公開手順

リモート未設定。GitHub にリポジトリを作成後：

```bash
# 1) GitHub に push（gh CLI を使う場合）
gh repo create keio-ramen-guide --private --source=. --remote=origin --push
# もしくは手動でリモートを追加して push
git remote add origin git@github.com:<your-account>/keio-ramen-guide.git
git push -u origin main
```

Vercel に公開：

```bash
# 2) Vercel CLI でデプロイ（初回はプロジェクト設定を対話で作成）
npm i -g vercel
vercel        # プレビュー
vercel --prod # 本番（検証URL）
```

または Vercel ダッシュボードで GitHub リポジトリを Import すれば、Next.js は自動検出される。

**Vercel の環境変数設定**（Project > Settings > Environment Variables）：`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` / `ADMIN_PASSWORD` を登録して再デプロイ。これらを入れるまで投稿機能は無効（サイトは表示される）。

公開前に、`app/layout.tsx` の `metadataBase` を実URLに、`components/PhotoCallout.tsx` の連絡先（`ramen-guide@example.com`）を実アドレス/SNSハンドルに差し替える。

### 公開URLを友達に共有する方法

- 各店舗ページは `/(検証URL)/shops/<shop-id>` で個別に共有できる（例：吉村家 → `/shops/yokohama-yoshimuraya`）。
- トップ（検証URL）を LINE に貼ると、OGP（タイトル「授業終わり、どこ啜る？」＋説明）が表示される。共有用の文面は [docs/test-message.md](docs/test-message.md)。

### スマホでの検証方法

- ローカル同一Wi-Fiでスマホ実機確認：`npm run dev -- -H 0.0.0.0` で起動し、スマホから `http://<PCのローカルIP>:3000` を開く。
- もっとも本番に近いのは Vercel のプレビューURLをスマホで開く方法（投稿・画像アップロードまで含めて確認できる）。
- 投稿フォームの写真入力は `accept="image/*"` のためスマホのカメラ/カメラロールから直接選べる。
