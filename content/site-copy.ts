// サイト内の主要文言はここに集約する。
// コピーを直したい時は、各ページ/コンポーネントではなくこのファイルだけを編集する。
// 方針：俗語・ポエム・絵文字・意味の薄い英語見出しを避け、自然で落ち着いた日本語にする。

export const copy = {
  serviceName: "Keio Ramen Guide",
  brandLine: "キャンパス周辺から、よく行く街まで",

  nav: {
    shops: "店を探す",
    map: "地図",
    post: "投稿",
    insights: "データ",
    quiz: "気分で選ぶ",
    saved: "保存",
  },

  metadata: {
    title: "Keio Ramen Guide｜慶應生のラーメンガイド",
    description: "慶應生のためのラーメンサイト。キャンパス周辺からよく行く街まで、慶應生とOB/OGの投稿で店が増えていきます。",
    ogTitle: "Keio Ramen Guide｜慶應生のラーメンガイド",
    ogDescription:
      "店選びは、食べた人の一言から。キャンパス周辺からよく行く街まで、慶應生とOB/OGの投稿で店が増えていくラーメンサイト。",
  },

  hero: {
    eyebrow: "慶應生のためのラーメンガイド",
    title: "店選びは、食べた人の一言から。",
    subtitle: "キャンパス周辺から、よく行く街まで。慶應生とOB/OGの投稿で店が増えていくラーメンサイトです。",
    primaryCta: "店を探す",
    secondaryCta: "投稿する",
    quizLead: "決めきれない日は",
    quizCta: "気分で選ぶ（30秒）",
  },

  // Hero写真のキャプション（今日の一杯）。
  featured: {
    label: "今日の一杯",
    cta: "この店を見る",
  },

  // Keio Picks（数を絞った基準の店。星や点数は使わない）。
  picks: {
    label: "特集",
    title: "Keio Picks",
    subtitle: "迷ったらここから。慶應生の基準になる店。",
    detail: "詳細",
  },

  // エリア＝慶應生の生活圏。駅や路線ではなく「そこで過ごす時間」で見せる。
  campus: {
    label: "エリア",
    title: "キャンパスの生活圏で選ぶ",
    count: (n: number) => `${n}店`,
    repLabel: "この街の一杯",
    viewArea: "この街の店を見る",
    areas: [
      {
        id: "日吉",
        name: "日吉",
        en: "HIYOSHI",
        context: "授業のあと、学生街でそのまま一杯。",
        meta: "東急東横線・日吉駅",
        rep: "hiyoshi-musashiya",
      },
      {
        id: "三田",
        name: "三田・田町",
        en: "MITA / TAMACHI",
        context: "昼休みと授業の合間に、歩ける範囲で。",
        meta: "都営三田線 三田駅・JR田町駅",
        rep: "mita-jiro",
      },
      {
        id: "横浜",
        name: "横浜",
        en: "YOKOHAMA",
        context: "遊びも乗り換えも多い、慶應生の生活圏。少し歩いて寄りたい店へ。",
        meta: "東急東横線・横浜駅 ｜ 生活圏エリア",
        rep: "yokohama-ishinshoten",
      },
    ],
  },

  // 追加予定エリア（Coming soon）。正直に「まだ無い」と見せ、リクエストへつなぐ。
  comingAreas: {
    liveLabel: "掲載中",
    upcomingLabel: "追加予定",
    note: "まだ載っていないキャンパス周辺の店も、投稿やリクエストから追加していきます。",
    requestCta: "店の掲載をリクエストする",
  },

  // 店舗の掲載リクエスト（/shops/request）
  request: {
    eyebrow: "掲載リクエスト",
    title: "店の掲載をリクエストする",
    subtitle: "掲載してほしい店を教えてください。内容を確認してから掲載します。キャンパス周辺以外の街でも大丈夫です。",
    fields: {
      name: "店名",
      namePlaceholder: "例：ラーメン◯◯ 日吉店",
      area: "エリア・街",
      areaPlaceholder: "例：日吉 / 信濃町 / 渋谷",
      station: "最寄駅",
      stationPlaceholder: "任意",
      mapUrl: "Google MapsのURL",
      mapUrlPlaceholder: "任意。あると確認が早くなります",
      genre: "ジャンル",
      genrePlaceholder: "例：家系 / 二郎系 / 醤油",
      reason: "推薦したい理由",
      reasonPlaceholder: "どんな店か、なぜ載せたいかを一言で。",
      requester: "お名前",
      requesterPlaceholder: "任意",
    },
    submit: "リクエストを送る",
    submitting: "送信中…",
    successTitle: "リクエストを受け取りました。",
    successBody: "内容を確認してから掲載します。ありがとうございます。",
    backToShops: "店の一覧に戻る",
    disabled: "リクエストの受付は現在準備中です。時間をおいてもう一度お試しください。",
    error: "送信に失敗しました。時間をおいてもう一度お試しください。",
  },

  // 地図ページ（/map）。Google Mapsへのリンク集として正直に作る。
  map: {
    eyebrow: "地図",
    title: "地図から探す",
    subtitle: "エリアごとの掲載店を、Google Mapsへのリンク付きで一覧できます。",
    openMap: "地図を開く",
    detail: "詳細",
    empty: "このエリアの掲載はまだありません。",
  },

  // 属性データの将来像（/insights）
  insights: {
    eyebrow: "データ",
    title: "慶應生のラーメンデータ",
    subtitle: "投稿に添えられた任意の属性から、慶應らしい集計を公開していきます。数字は捏造せず、投稿が集まり次第、実数で公開します。",
    postsSoFar: (n: number) => `現在の投稿数：${n}件`,
    plannedLabel: "公開予定の集計",
    planned: [
      { title: "キャンパス別の人気店", body: "日吉・三田・信濃町・SFC…。どのキャンパスで、どの店が強いか。" },
      { title: "学部別の傾向", body: "経済と理工で好みは違うのか。学部ごとの定番を集計します。" },
      { title: "現役とOB/OGの違い", body: "在学中の定番と、卒業後に恋しくなる一杯は同じか。" },
      { title: "MBTI別の傾向", body: "性格タイプと麺の好みに関係はあるのか。遊びとして集計します。" },
      { title: "男女差・学年差", body: "属性はすべて任意入力。集計にのみ使い、個人が分かる形では公開しません。" },
    ],
    cta: "投稿してデータを増やす",
    note: "属性の入力はすべて任意です。未入力でも投稿できます。",
  },

  recentLogs: {
    label: "投稿",
    title: "みんなの投稿",
    subtitle: "慶應生が実際に食べた一杯。",
    viewAll: "投稿する",
    empty: { title: "最初の投稿を待っています。", cta: "食べた店を投稿する" },
    // 投稿0件でも「ここから育つ」と伝えるための招待ブロック
    invite: {
      lead: "ここに、慶應生の実食が並んでいく。",
      body: "食べた一杯を写真とひとことで残すと、次の誰かの店選びになります。投稿はすぐにサイトに表示されます。",
      cta: "食べた店を投稿する",
      note: "写真がなくても投稿できます。",
    },
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
      jiro: { ja: "二郎系", note: "量と濃さに挑みたい日に。" },
    } as Record<string, { ja: string; note: string }>,
  },

  about: {
    title: "このサイトについて",
    body: "慶應生・OB/OGが、キャンパス周辺やよく行く街のラーメンを探して投稿するサイトです。ランキングや広告ではなく、実際に食べた人の投稿と価格の目安で選べます。エリアと店は、投稿と掲載リクエストで増えていきます。",
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
    eyebrow: "投稿",
    title: "食べた店を投稿する",
    subtitle: "メニューと金額、ひとことだけでも十分です。投稿後、すぐにサイトに表示されます。",
    disabledTitle: "準備中",
    disabledBody: "投稿機能はSupabaseの設定後に有効になります。手順はREADMEを参照してください。",
    moderationNote: "投稿後、すぐにサイトに表示されます。",
    rights: "掲載できるのは、自分で撮った写真だけです。",
    submit: "投稿する",
    submitting: "送信中…",
    successTitle: "ごちそうさまでした。",
    successBody: "トップと店のページに表示されます。",
    successExplore: "店を見る",
    successAgain: "続けて投稿する",
    anon: "名無しの慶應生",
    fields: {
      shop: "店を選ぶ",
      shopSearchPlaceholder: "店名・駅・ジャンルで探す（例：武蔵家、日吉、家系）",
      shopDefaultLabel: "よく投稿される店",
      shopChange: "変更",
      shopEmpty: "掲載店に見つかりません。店名を確認するか、掲載リクエストしてください。",
      photo: "写真",
      photoHint: "タップして写真を追加",
      photoChange: "タップで変更",
      menu: "食べたメニュー",
      menuPlaceholder: "例：ラーメン＋ライス",
      price: "払った金額",
      pricePlaceholder: "950",
      note: "ひとこと",
      notePlaceholder: "味・量・並び・雰囲気を一言で。",
      scene: "シーン",
      name: "投稿者名",
      namePlaceholder: "空欄なら「名無しの慶應生」と表示されます",
      optional: "任意",
    },
    // 任意の属性セクション（/insights の集計用）
    aboutYou: {
      summary: "あなたについて（任意）",
      note: "集計にのみ使います。個人が分かる形では表示しません。",
      affiliation: "所属",
      campus: "キャンパス",
      faculty: "学部",
      grade: "学年・卒業年",
      gradePlaceholder: "例：B3 / 2020年卒",
      gender: "性別",
      mbti: "MBTI",
      unset: "回答しない",
    },
  },

  quiz: {
    eyebrow: "気分",
    title: "気分で選ぶ",
    subtitle: "1問ずつ、ぜんぶで30秒。いまの気分に近い一杯を出します。",
    progress: (current: number, total: number) => `Q${current} / ${total}`,
    back: "前の質問へ",
    submit: "結果を見る",
  },
  results: {
    eyebrow: "結果",
    title: "気分に近い一杯",
    subtitle: "いまの気分に、近い順で並べています。",
    topLabel: "きょうの推薦",
    reasonLabel: "推薦の理由",
    othersLabel: "次の候補",
    view: "この店を見る",
    again: "もう一度選ぶ",
    allShops: "すべての店を見る",
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
    "Keio Ramen Guide｜慶應生とOB/OGの投稿で育つラーメンサイト。価格・営業時間は変わることがあります。",
};

export type SiteCopy = typeof copy;
