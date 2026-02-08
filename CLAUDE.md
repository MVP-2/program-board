# program-board - プロジェクトガイド

探究プログラムを掲示板のように一覧表示し、生徒が参加申込できる検証用 Web アプリ。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **認証・DB**: Supabase (Auth + PostgreSQL)
- **ORM**: Drizzle
- **スタイリング**: Tailwind CSS v4
- **UI**: Radix UI (shadcn/ui ベースのコンポーネント)
- **フォーム**: React Hook Form + Zod
- **リント・フォーマット**: Biome

## アカウントロール

| ロール | パス | 主な機能 |
|--------|------|----------|
| **admin** | `/admin` | 掲載状況・生徒一覧・生徒/掲載者アカウント作成・CSV出力 |
| **publisher** | `/publisher` | プログラムの作成・編集・削除・参加者一覧 |
| **student** | `/student` | プログラム一覧閲覧・参加申込・参加済み一覧 |

ロールは Supabase Auth の `user.app_metadata.role` で管理。ミドルウェアで未ログイン時は `/login` にリダイレクトし、ロール別にパスを制御。

## ディレクトリ構造

```
app/
  (auth)/          # ログイン画面
  (main)/          # 認証必須のメイン画面
    admin/         # 管理者用
    publisher/     # 掲載者用
    student/       # 生徒用
  auth/callback/   # Supabase 認証コールバック

components/ui/     # shadcn/ui 系 UI コンポーネント
db/                # Drizzle スキーマ・接続
lib/
  auth.tsx         # 認証コンテキスト
  repositories/    # データアクセス層 (programs, students, participations)
  supabase/        # Supabase クライアント (client, server, middleware)
```

## アーキテクチャの特徴

- **Server Actions**: フォーム送信・データ変更はほぼ Server Actions (`"use server"`)
- **Route Handlers**: `/auth/callback` (認証) と `/admin/csv` (CSV エクスポート) のみ
- **リポジトリパターン**: `lib/repositories/` で DB アクセスを集約
- **認証チェック**: 各 Server Action と Route Handler で `supabase.auth.getUser()` と `app_metadata.role` を検証

## 主なスクリプト

| コマンド | 内容 |
|----------|------|
| `pnpm dev` | 開発サーバー起動 |
| `pnpm build` | 本番ビルド |
| `pnpm lint` | Biome でリント・フォーマット・import 整理 |
| `pnpm lint:check` | 修正なしでチェックのみ |
| `pnpm typecheck` | 型チェック |
| `pnpm db:generate` | Drizzle マイグレーション生成 |
| `pnpm db:migrate` | マイグレーション実行 |
| `pnpm db:studio` | Drizzle Studio 起動 |

## 開発環境のセットアップ

1. `pnpm install`
2. `.env.example` をコピーして `.env.local` を作成
3. Supabase ローカル: `npx supabase start`（必要に応じて）
4. シード: `supabase/seed.example.sql` を `seed.sql` にコピーして編集（`seed.sql` は .gitignore 済み）
5. `pnpm dev`

## コーディング規約

- **Biome**: リント・フォーマットは Biome に統一（ESLint/Prettier は未使用）
- **パスエイリアス**: `@/` でプロジェクトルートを参照
- **DB カラム**: snake_case（Drizzle で `casing: "snake_case"`）
- **レスポンス**: 日本語メッセージを使用

## 注意事項

- `supabase/seed.sql` は本番初期データを含むため非公開。`seed.example.sql` をテンプレートとして使用
- 管理者アカウントは seed や DB 直接操作で作成。管理者画面からは掲載者アカウントのみ作成可能
