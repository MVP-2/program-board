#!/usr/bin/env node
import { spawnSync } from "node:child_process";
/**
 * .env ファイルから指定した変数を読み、Vercel の Preview 環境に追加する。
 * 使い方: node scripts/add-preview-env.mjs .env.preview-temp
 */
import { readFileSync } from "node:fs";

const envPath = process.argv[2] || ".env.preview-temp";
const vars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "POSTGRES_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SITE_URL",
];

const content = readFileSync(envPath, "utf8");

for (const name of vars) {
  const m = content.match(new RegExp(`${name}\\s*=\\s*["']?([^"'\n]+)["']?`));
  if (!m) {
    console.error(`Skip: ${name} not found`);
    continue;
  }
  const value = m[1].replace(/\\n/g, "").trim();
  const result = spawnSync(
    "vercel",
    ["env", "add", name, "preview", "--force"],
    { input: value, stdio: ["pipe", "inherit", "inherit"] },
  );
  if (result.status !== 0) {
    process.exitCode = 1;
  }
}
