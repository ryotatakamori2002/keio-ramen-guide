// サイト内の主要文言はここに集約する。
// コピーを直したい時は、各ページ/コンポーネントではなくこのファイルを編集する。
// （ブランドの方向性：俗っぽいラーメン用語を避け、「慶應生の編集された実食ログ」として落ち着いた表現にする）

export const copy = {
  serviceName: "Keio Ramen Guide",
  brandLine: "The Keio Ramen Log",

  nav: {
    shops: "Shops",
    post: "Log",
    quiz: "Mood",
    saved: "Saved",
  },

  // メタ情報（LINE共有を想定）
  meta: {
    title: "Keio Ramen Guide — The Keio Ramen Log",
    description:
      "日吉・三田・横浜。慶應生の実食ログで育つラーメンガイド。記録から、次の一杯を選ぶ。",
    ogTitle: "Keio Ramen Guide — The Keio Ramen Log",
    ogDescription:
      "日吉、三田、横浜の一杯を記録する。食べた人の記録から、次の一杯を選ぶ。慶應生のためのラーメンノート。",
  },

  // トップ：Editorial Hero
  hero: {
    eyebrow: "The Keio Ramen Log",
    title: "日吉、三田、横浜。\n一杯を、記録する。",
    subtitle:
      "広告でもランキングでもなく、慶應生の実食ログで育つラーメンガイド。食べた人の記録から、次の一杯を選ぶ。",
    primaryCta: "Explore",
    secondaryCta: "Add a Log",
  },

  // トップ：セクション
  sections: {
    area: { label: "Area Index", title: "エリアから選ぶ" },
    logs: { label: "The Logs", title: "実食ログ", subtitle: "慶應生が記録した一杯。" },
    shelves: { label: "Curated", title: "用途から選ぶ" },
    about: { label: "About", title: "このサイトについて" },
  },

  about:
    "Keio Ramen Guide は、ラーメンデータベースの劣化版ではありません。広告でもランキングでもなく、慶應生の実食ログで日吉・三田・横浜の店を記録していく、編集されたラーメンノートです。",

  areas: [
    { id: "日吉", name: "日吉", en: "Hiyoshi", note: "授業後、空きコマ、一人飯。キャンパス徒歩圏の一杯。" },
    { id: "三田", name: "三田・田町", en: "Mita", note: "昼休みと授業後。三田キャンパス周辺で。" },
    { id: "横浜", name: "横浜", en: "Yokohama", note: "遊び・乗り換え・帰り道に。横浜駅周辺。" },
  ],

  // 用途別ベスト棚：英字名＋和文。lib/shelves.ts の id に対応。
  shelfTitles: {
    "hiyoshi-after-class": { en: "Between Classes", ja: "授業の合間に" },
    solo: { en: "Solo Counter", ja: "一人で、カウンターで" },
    "after-drinking": { en: "Late Night", ja: "飲んだあとに" },
    "first-iekei": { en: "First Iekei", ja: "初めての家系" },
    hearty: { en: "Big Bowl", ja: "腹いっぱいにしたい日" },
    "no-queue": { en: "No Wait", ja: "並びたくない日" },
    "gap-time": { en: "Quick One", ja: "空きコマで一杯" },
    "mita-lunch": { en: "Mita Lunch", ja: "三田の昼休み" },
    "yokohama-nofail": { en: "Yokohama Picks", ja: "横浜で外さない" },
    jiro: { en: "Jiro", ja: "二郎系" },
  } as Record<string, { en: string; ja: string }>,

  shops: {
    title: "Shops",
    subtitle: "日吉・三田・横浜。エリアと気分から、次の一杯を。",
    searchPlaceholder: "店名・駅・ジャンルで検索",
    filterArea: "Area",
    filterCondition: "Mood",
    filterGenre: "Genre",
    includeCandidates: "調査中の店も表示",
    empty: "条件に合う店が見つかりませんでした。条件を減らしてください。",
    count: (n: number) => `${n} shops`,
  },

  // 店舗カード/詳細
  shop: {
    review: "要確認",
    logsLabel: "Logs",
    logsNone: "No logs yet",
    addLog: "Log",
    detail: "View",
    maps: "Maps",
    firstVisitLabel: "First order",
  },

  // 店舗詳細
  detail: {
    back: "← Shops",
    logsTitle: { label: "The Logs", title: "実食ログ" },
    logsEmpty: "まだ記録がありません。",
    logsEmptyCta: "最初の一杯を記録する",
    notesTitle: { label: "Decision Notes", title: "選ぶ理由・避ける理由" },
    reason: "選ぶ理由",
    avoid: "避けたい日",
    queue: "並び",
    solo: "一人",
    beginner: "初心者",
    taste: "味・雰囲気",
    rules: "注文のこと",
    useCaseTitle: { label: "Keio Use Case", title: "どんな時に" },
    dataTitle: { label: "Data Note", title: "情報について" },
    lastChecked: "Last checked",
    confidence: "Confidence",
    reviewBanner:
      "情報を確認中の店です。実在・営業・価格を、訪問前にGoogle Mapsや公式でご確認ください。",
    dataNote:
      "価格・営業時間・並びは変動します。訪問前にGoogle Mapsや公式情報で最新をご確認ください。",
  },

  // 投稿ページ
  post: {
    eyebrow: "Add a Log",
    title: "一杯を、記録する。",
    subtitle: "食べた一杯を残すと、次に行く人の助けになります。30秒で。",
    disabledTitle: "準備中",
    disabledBody: "投稿機能はSupabase設定後に有効になります。手順はREADMEを参照してください。",
    rights: "掲載できるのは、自分で撮った写真か、許可を得た写真だけです。",
    submit: "Submit",
    submitting: "送信中…",
    successTitle: "記録しました。",
    successBody: "確認のうえ掲載します。ありがとうございます。",
    successExplore: "店舗を見る →",
    successAgain: "続けて記録する",
    anon: "名無しの慶應生",
    fields: {
      shop: "店舗",
      shopPlaceholder: "店舗を選ぶ",
      photo: "写真",
      photoHint: "タップして写真を選ぶ（自分で撮った写真のみ）",
      menu: "頼んだ一杯",
      menuPlaceholder: "例：ラーメン＋ライス",
      price: "払った金額",
      pricePlaceholder: "950",
      note: "ひとこと",
      notePlaceholder: "味・量・並び・雰囲気を一言で。",
      scene: "シーン",
      name: "名前",
      namePlaceholder: "任意。空欄でもOK",
      optional: "任意",
    },
  },

  // 診断
  quiz: {
    eyebrow: "Mood",
    title: "気分から選ぶ",
    subtitle: "5つの質問、30秒。今の気分に近い一杯を。",
    submit: "結果を見る",
    intro: "エリアと気分から、次の一杯を絞り込みます。",
  },
  results: {
    eyebrow: "Results",
    title: "気分に近い一杯",
    subtitle: "回答から、相性の良い順に。",
    again: "もう一度選ぶ",
    matchLabel: "Match",
  },
  saved: {
    eyebrow: "Saved",
    title: "保存した店",
    subtitle: "「行きたい」「行った」がここに集まります。",
    want: "行きたい",
    visited: "行った",
    empty: "まだありません。",
    exploreCta: "店舗を見る",
  },

  // 管理画面
  admin: {
    title: "Logs — Review",
    loginPrompt: "管理パスワードでログインしてください。",
    passwordPlaceholder: "管理パスワード",
    login: "ログイン",
    loggingIn: "確認中…",
    logout: "ログアウト",
    pendingCount: (n: number) => `承認待ち ${n}`,
    empty: "承認待ちの投稿はありません。",
    notConfigured: "Supabaseが未設定のため投稿を取得できません。READMEの手順に従ってください。",
    approve: "承認",
    reject: "却下",
    noPhoto: "No photo",
    anon: "名無し",
  },

  // 写真なし/空状態（押し付けない）
  empty: {
    noPhoto: "No photo yet",
  },

  footer:
    "Keio Ramen Guide — 日吉・三田・横浜のラーメンを、慶應生の実食ログで。価格・営業時間は変動します。訪問前に各店の最新情報をご確認ください。",
};

export type SiteCopy = typeof copy;
