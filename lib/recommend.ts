import type { Shop } from "./types";
import { TASTE_TO_GENRE, type QuizAnswers } from "./quiz";

export interface RecommendResult {
  shop: Shop;
  score: number;
  reasons: string[];
}

function pushReason(reasons: string[], reason: string) {
  if (!reasons.includes(reason)) reasons.push(reason);
}

function scoreShop(shop: Shop, answers: QuizAnswers): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // エリア一致
  if (answers.location !== "any") {
    if (shop.area === answers.location) {
      score += 20;
      pushReason(reasons, `${answers.location}エリアで探せる`);
    }
  } else {
    score += 4;
  }

  // ジャンル一致
  const targetGenre = TASTE_TO_GENRE[answers.taste];
  if (targetGenre && shop.genres.includes(targetGenre)) {
    score += 20;
    pushReason(reasons, `好みの「${targetGenre}」が楽しめる`);
  }

  // シーン一致（直接タグ一致のボーナス）
  if (shop.sceneTags.includes(answers.scene)) {
    score += 8;
  }

  // シーン別の重み付け
  switch (answers.scene) {
    case "after_class": {
      const proximity = Math.max(0, 20 - shop.campusWalkMin);
      score += proximity;
      if (shop.campusWalkMin <= 8) {
        pushReason(reasons, `キャンパスから徒歩${shop.campusWalkMin}分で授業後にちょうどいい`);
      }
      break;
    }
    case "gap_time": {
      score += shop.speedLevel * 5;
      if (shop.speedLevel >= 4) pushReason(reasons, "回転が早く空きコマでも入れる");
      break;
    }
    case "solo": {
      score += shop.soloFriendly * 5;
      if (shop.soloFriendly >= 4) pushReason(reasons, "一人でも入りやすい雰囲気");
      break;
    }
    case "with_friends": {
      score += shop.friendFriendly * 5;
      if (shop.friendFriendly >= 4) pushReason(reasons, "友達と行っても盛り上がる");
      break;
    }
    case "after_club": {
      score += shop.volume * 3 + shop.friendFriendly * 3 + (shop.lateNight ? 10 : 0);
      if (shop.lateNight) pushReason(reasons, "サークル後の遅い時間でも入れる");
      break;
    }
    case "after_drinking": {
      score += shop.lateNight ? 20 : 0;
      if (shop.lateNight) pushReason(reasons, "深夜営業で飲み後の〆にも対応");
      break;
    }
    case "hearty": {
      score += shop.volume * 6;
      if (shop.volume >= 4) pushReason(reasons, "ボリューム満点でがっつり食べられる");
      break;
    }
    case "no_fail": {
      score += shop.keioStudentScore * 5 + shop.beginnerFriendly * 2;
      if (shop.keioStudentScore >= 4) pushReason(reasons, "慶應生からの支持が高く失敗しにくい");
      break;
    }
  }

  // 重さ（あっさり〜限界まで重い）
  const richnessTarget: Record<QuizAnswers["richness"], number> = {
    light: 1,
    normal: 3,
    rich: 4,
    extreme: 5,
  };
  const richnessDiff = Math.abs(richnessTarget[answers.richness] - shop.richness);
  score += Math.max(0, 10 - richnessDiff * 3);

  // 量（軽め〜腹パン）
  const volumeTarget: Record<QuizAnswers["volume"], number> = {
    light: 2,
    normal: 3,
    hearty: 5,
  };
  const volumeDiff = Math.abs(volumeTarget[answers.volume] - shop.volume);
  score += Math.max(0, 10 - volumeDiff * 3);
  if (answers.volume === "hearty" && shop.volume >= 4) {
    pushReason(reasons, "腹パンになれる量");
  }

  // 初心者向け度
  if (answers.beginner === "beginner") {
    score += shop.beginnerFriendly * 4;
    if (shop.beginnerFriendly >= 4) pushReason(reasons, "初心者でも注文しやすい");
  } else if (answers.beginner === "expert_ok") {
    score += (6 - shop.beginnerFriendly) * 2;
  }

  // 並び
  if (answers.queue === "avoid") {
    score += (6 - shop.queueLevel) * 4;
    if (shop.queueLevel <= 2) pushReason(reasons, "並びにくく入りやすい");
  } else if (answers.queue === "can_queue") {
    score += shop.queueLevel * 2;
  }

  // 慶應生人気（ベースライン）
  score += shop.keioStudentScore * 2;
  if (shop.keioStudentScore >= 5 && !reasons.some((r) => r.includes("慶應生"))) {
    pushReason(reasons, "慶應生に人気の一軒");
  }

  return { score, reasons: reasons.slice(0, 3) };
}

export function recommend(shops: Shop[], answers: QuizAnswers, limit = 5): RecommendResult[] {
  return shops
    .map((shop) => {
      const { score, reasons } = scoreShop(shop, answers);
      return { shop, score, reasons };
    })
    .sort((a, b) => b.score - a.score || b.shop.keioStudentScore - a.shop.keioStudentScore)
    .slice(0, limit);
}
