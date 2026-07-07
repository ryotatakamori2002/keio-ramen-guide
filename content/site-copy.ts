// サイト内の主要文言はここに集約する。
// コピーを直したい時は、各ページ/コンポーネントではなくこのファイルだけを編集する。
// 方針：俗語・ポエム・絵文字・意味の薄い英語見出しを避け、自然で落ち着いた日本語にする。

export const copy = {
  serviceName: "Keio Ramen Guide",
  brandLine: "日吉・三田・横浜",

  nav: {
    shops: "店を探す",
    post: "投稿",
    quiz: "気分で選ぶ",
    saved: "保存",
  },

  metadata: {
    title: "Keio Ramen Guide｜慶應生のラーメンガイド",
    description: "日吉・三田・横浜のラーメンを、慶應生の投稿と価格の目安から探せるガイド。",
    ogTitle: "Keio Ramen Guide｜慶應生のラーメンガイド",
    ogDescription:
      "店選びは、食べた人の一言から。日吉・三田・横浜のラーメンを、慶應生の投稿と価格の目安から探せるガイド。",
  },

  hero: {
    eyebrow: "慶應生のためのラーメンガイド",
    title: "店選びは、食べた人の一言から。",
    subtitle: "日吉・三田・横浜のラーメンを、実際に食べた慶應生の投稿と価格の目安で選べます。",
    primaryCta: "店を探す",
    secondaryCta: "投稿する",
    quizLead: "決めきれない日は",
    quizCta: "気分で選ぶ（30秒）",
  },

  // Heroと帯の「今日の一杯」（Featured Bowl）。
  featured: {
    label: "今日の一杯",
    cta: "この店を見る",
    postCta: "食べたら投稿する",
  },

  // Keio Picks（数を絞った基準の店。星や点数は使わない）。
  picks: {
    label: "特集",
    title: "Keio Picks",
    subtitle: "迷ったらここから。慶應生の基準になる店。",
    detail: "詳細",
  },

  // Area Indexの沿線図。三田−日吉−横浜が1本の鉄道軸でつながっている事実をそのまま見せる。
  lineMap: {
    sectionLabel: "エリア",
    sectionTitle: "キャンパスの沿線で選ぶ",
    count: (n: number) => `${n}店`,
    legend: "赤い印は、慶應キャンパスの最寄り駅",
    stations: [
      { id: "三田", name: "三田・田町", en: "Mita", note: "三田キャンパスの昼休みと授業後に", campus: true },
      { id: "日吉", name: "日吉", en: "Hiyoshi", note: "日吉キャンパスから徒歩圏で", campus: true },
      { id: "横浜", name: "横浜", en: "Yokohama", note: "帰り道や遊びのついでに", campus: false },
    ],
    segments: ["都営三田線・東急目黒線で直通", "東急東横線 急行で約15分"],
  },

  recentLogs: {
    label: "投稿",
    title: "みんなの投稿",
    subtitle: "慶應生が実際に食べた一杯。",
    viewAll: "投稿する",
    empty: { title: "最初の投稿を待っています。", cta: "一杯を記録する" },
  },

  curated: {
    label: "シーン",
    title: "シーンで選ぶ",
    viewAll: "すべての店",
    // 棚ごとの短い編集意図。lib/shelves.ts の id に対応。
    titles: {
      "hiyoshi-after-class": { ja: "授業後に", note: "キャンパスからすぐ行ける店。" },
      solo: { ja: "一人で", note: "カウンター中心で入りやすい店。" },
      "after-drinking": { ja: "遅い時間に", note: "飲んだあとや深夜でも開いている店。" },
      "first-iekei": { ja: "初めての家系", note: "濃さも頼み方も、まずここから。" },
      hearty: { ja: "しっかり食べたい", note: "量で満たされたい日に。" },
      "no-queue": { ja: "並びたくない", note: "回転が速く、待たずに入りやすい店。" },
      "gap-time": { ja: "空きコマに", note: "短時間でさっと食べたい時に。" },
      "mita-lunch": { ja: "三田の昼に", note: "昼休みに歩いて行ける店。" },
      "yokohama-nofail": { ja: "横浜で選ぶ", note: "遊びや帰り道の途中で。" },
      jiro: { ja: "二郎系", note: "がっつり系に挑みたい日に。" },
    } as Record<string, { ja: string; note: string }>,
  },

  about: {
    title: "このサイトについて",
    body: "ランキングや広告ではなく、実際に食べた慶應生の投稿と価格の目安から店を選べるガイドです。エリアは日吉・三田・横浜の3つに絞り、投稿は掲載前に内容を確認しています。",
  },

  notFound: {
    title: "ページが見つかりませんでした",
    body: "URLが変わったか、削除された可能性があります。",
    cta: "店を探す",
  },

  shops: {
    title: "店を探す",
    subtitle: "エリア・気分・ジャンルで絞り込めます。迷ったら",
    searchPlaceholder: "店名・駅・ジャンルで検索",
    filterArea: "エリア",
    filterMood: "気分",
    filterGenre: "ジャンル",
    includeCandidates: "調査中の店も表示",
    empty: "条件に合う店が見つかりませんでした。少し条件をゆるめてみてください。",
    count: (n: number) => `${n}店`,
    postPrompt:
      "食べたことのある店があれば、ひとことだけでも投稿してください。次に行く人の判断材料になります。",
    postCta: "投稿する",
  },

  // 店舗カード
  shopCard: {
    review: "要確認",
    logsCount: (n: number) => `投稿 ${n}件`,
    detail: "詳細",
    maps: "地図",
    log: "投稿",
  },

  // 店舗詳細
  shopDetail: {
    back: "← 店を探す",
    firstOrderLabel: "初回におすすめ",
    maps: "地図で見る",
    addLog: "投稿する",
    logs: {
      title: "みんなの投稿",
      empty: "まだ投稿はありません。",
      emptyCta: "最初の一件を投稿する",
    },
    notes: {
      title: "選ぶ・避ける",
      reason: "選ぶ理由",
      avoid: "避けたい日",
      queue: "並び",
      solo: "一人",
      beginner: "初心者",
      taste: "味・雰囲気",
      rules: "注文のこと",
    },
    useCase: { title: "どんな時に" },
    data: { title: "情報について", lastChecked: "最終確認", confidence: "情報の信頼度" },
    reviewBanner:
      "情報を確認中の店です。実在・営業・価格は、訪問前にGoogle Mapsや公式でご確認ください。",
    dataNote:
      "価格・営業時間・並びは変わることがあります。訪問前にGoogle Mapsや公式で最新をご確認ください。",
  },

  post: {
    eyebrow: "記録",
    title: "食べた一杯を記録する",
    subtitle: "自分の記録として残り、次に行く誰かの判断材料になります。写真は無くても大丈夫です。",
    disabledTitle: "準備中",
    disabledBody: "投稿機能はSupabaseの設定後に有効になります。手順はREADMEを参照してください。",
    moderationNote: "投稿は承認後に掲載されます。",
    rights: "掲載できるのは、自分で撮った写真だけです。",
    submit: "投稿する",
    submitting: "送信中…",
    successTitle: "ごちそうさまでした。",
    successBody: "記録を受け取りました。内容を確認してから掲載します。",
    successExplore: "店を見る",
    successAgain: "続けて投稿する",
    anon: "名無しの慶應生",
    fields: {
      shop: "店",
      shopSearchPlaceholder: "店名・駅名で探す",
      shopChange: "変更",
      shopEmpty: "掲載店に見つかりませんでした。",
      shopEmptyHint: "追加してほしい店があれば、別の店の記録の「ひとこと」に店名を添えてください。次の更新で検討します。",
      shopReset: "掲載店の一覧に戻る",
      photo: "写真",
      photoHint: "タップして写真を追加",
      photoChange: "タップで変更",
      menu: "頼んだ一杯",
      menuPlaceholder: "例：ラーメン＋ライス",
      price: "払った金額",
      pricePlaceholder: "950",
      note: "ひとこと",
      notePlaceholder: "味・量・並び・雰囲気を一言で。",
      scene: "シーン",
      name: "ニックネーム",
      namePlaceholder: "空欄なら「名無しの慶應生」と表示されます",
      optional: "任意",
    },
  },

  quiz: {
    eyebrow: "気分",
    title: "気分で選ぶ",
    subtitle: "5つの質問、30秒。今の気分に近い一杯を。",
    submit: "結果を見る",
  },
  results: {
    eyebrow: "結果",
    title: "気分に近い一杯",
    subtitle: "回答から、相性の良い順に。",
    again: "もう一度選ぶ",
    matchLabel: "相性",
  },
  saved: {
    eyebrow: "保存",
    title: "保存した店",
    subtitle: "店のカードで「行きたい」「行った」を押すと、ここに並びます。",
    want: "行きたい",
    visited: "行った",
    empty: "まだありません。",
    exploreCta: "店を探す",
  },

  admin: {
    title: "投稿の確認",
    loginPrompt: "管理パスワードでログインしてください。",
    passwordPlaceholder: "管理パスワード",
    login: "ログイン",
    loggingIn: "確認中…",
    logout: "ログアウト",
    pendingCount: (n: number) => `承認待ち ${n}件`,
    empty: "承認待ちの投稿はありません。",
    notConfigured: "Supabaseが未設定のため投稿を取得できません。READMEの手順に従ってください。",
    approve: "承認",
    reject: "却下",
    noPhoto: "写真なし",
    anon: "名無し",
  },

  footer:
    "Keio Ramen Guide｜日吉・三田・横浜のラーメンを、慶應生の投稿から。価格・営業時間は変わることがあります。",
};

export type SiteCopy = typeof copy;
