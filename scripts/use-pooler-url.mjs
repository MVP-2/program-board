#!/usr/bin/env node
/**
 * 現在の POSTGRES_URL（直接接続）から Session pooler 用の URL を生成する。
 * Vercel 本番で ENOTFOUND db.xxx.supabase.co を防ぐために使用。
 *
 * 使い方:
 *   node scripts/use-pooler-url.mjs [.env.production.local]
 *   または
 *   POSTGRES_URL="postgresql://..." REGION=ap-northeast-1 node scripts/use-pooler-url.mjs
 *
 * 生成した URL を Vercel に設定:
 *   node scripts/use-pooler-url.mjs .env.production.local | vercel env add POSTGRES_URL production --force
 *
 * 環境変数:
 *   POSTGRES_URL - 現在の直接接続の URL（未設定時は第1引数ファイルから読み取り）
 *   REGION       - プーラーのリージョン（省略時: us-east-1）。日本なら ap-northeast-1
 */

import { readFileSync } from "node:fs";

function getPostgresUrl() {
  if (process.env.POSTGRES_URL) return process.env.POSTGRES_URL;
  const envPath = process.argv[2];
  if (!envPath) return null;
  try {
    const content = readFileSync(envPath, "utf8");
    const m = content.match(/POSTGRES_URL\s*=\s*["']?([^"'\n]+)["']?/);
    return m ? m[1].replace(/\\n/g, "").trim() : null;
  } catch {
    return null;
  }
}

const directUrl = getPostgresUrl();
const region = process.env.REGION || "us-east-1";

if (!directUrl) {
  console.error(
    "POSTGRES_URL を設定するか、.env.production.local のパスを引数で指定してください。",
  );
  process.exit(1);
}

let url;
try {
  url = new URL(directUrl);
} catch {
  console.error("POSTGRES_URL の形式が不正です。");
  process.exit(1);
}

const hostname = url.hostname;
const poolerHost = `aws-0-${region}.pooler.supabase.com`;

const poolerUrl = new URL(directUrl);

// すでにプーラー URL の場合はリージョンだけ差し替え
const poolerMatch = hostname.match(
  /^aws-0-[a-z0-9-]+\.pooler\.supabase\.com$/i,
);
if (poolerMatch) {
  poolerUrl.hostname = poolerHost;
  poolerUrl.port = "6543";
  console.log(poolerUrl.toString());
  process.exit(0);
}

// 直接接続 URL からプーラー URL を生成
const directMatch = hostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/i);
if (!directMatch) {
  console.error(
    "Supabase の直接接続 (db.xxx.supabase.co) またはプーラー URL を指定してください。",
  );
  process.exit(1);
}

const projectRef = directMatch[1];
poolerUrl.username = `postgres.${projectRef}`;
poolerUrl.password = url.password;
poolerUrl.hostname = poolerHost;
poolerUrl.port = "6543";

console.log(poolerUrl.toString());
