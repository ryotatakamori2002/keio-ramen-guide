// 投稿フォームの任意属性（/insights の集計用）。
// フォームとServer Actionの両方から使い、値はこのホワイトリストでだけ受け付ける。
// すべて任意。「回答しない」は保存しない（null）。

export const AFFILIATION_OPTIONS = ["現役", "OB・OG", "その他"] as const;

export const CAMPUS_OPTIONS = ["日吉", "矢上", "三田", "信濃町", "湘南藤沢", "芝共立", "その他"] as const;

export const FACULTY_OPTIONS = [
  "文学部",
  "経済学部",
  "法学部",
  "商学部",
  "医学部",
  "理工学部",
  "総合政策学部",
  "環境情報学部",
  "看護医療学部",
  "薬学部",
  "その他",
] as const;

export const GENDER_OPTIONS = ["男性", "女性", "その他"] as const;

export const MBTI_OPTIONS = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const;

export function pickAllowed(value: string, allowed: readonly string[]): string | null {
  return allowed.includes(value) ? value : null;
}
