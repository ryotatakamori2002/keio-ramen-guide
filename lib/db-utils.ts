import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// スキーマ更新（schema.sqlの再実行）が本番DBにまだ適用されていない間も
// 投稿・リクエストを壊さないための保険。
// 「カラムが存在しない」系のエラーなら、任意カラムを外してもう一度だけ試す。
function isMissingColumnError(error: { code?: string; message?: string }): boolean {
  if (error.code === "42703" || error.code === "PGRST204") return true;
  return Boolean(error.message && /column/i.test(error.message) && /schema cache|does not exist/i.test(error.message));
}

export function isMissingTableError(error: { code?: string; message?: string }): boolean {
  if (error.code === "42P01" || error.code === "PGRST205") return true;
  return Boolean(error.message && /relation .* does not exist|Could not find the table/i.test(error.message));
}

export interface DbError {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
}

export async function insertWithColumnFallback(
  db: SupabaseClient,
  table: string,
  payload: Record<string, unknown>,
  optionalKeys: string[],
): Promise<{ error: DbError | null; strippedOptional: boolean }> {
  const { error } = await db.from(table).insert(payload);
  if (!error) return { error: null, strippedOptional: false };
  if (!isMissingColumnError(error) || optionalKeys.length === 0) return { error, strippedOptional: false };

  const stripped = Object.fromEntries(Object.entries(payload).filter(([k]) => !optionalKeys.includes(k)));
  console.warn(`insertWithColumnFallback: retrying ${table} without optional columns (run supabase/schema.sql to add them)`);
  const retry = await db.from(table).insert(stripped);
  return { error: retry.error, strippedOptional: true };
}
