-- シードのテンプレート
-- このファイルを seed.sql にコピーし、環境に合わせて編集してください。
-- cp supabase/seed.example.sql supabase/seed.sql

-- pgcrypto 拡張を有効化（crypt用）
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ========== 1. auth.users ==========
-- 管理者・掲載者・生徒の auth.users を INSERT
-- 例: INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, ...) VALUES (...);
-- パスワードは crypt('あなたのパスワード', gen_salt('bf')) でハッシュ化

-- ========== 2. auth.identities ==========
-- auth.users に対応する identities を INSERT
-- 例: INSERT INTO auth.identities (...) SELECT ... FROM auth.users WHERE id IN (...);

-- ========== 3. students テーブル ==========
-- INSERT INTO students (id, email, name) VALUES (...);

-- ========== 4. programs テーブル（任意） ==========
-- INSERT INTO programs (id, title, description, theme, period_format, status, created_by) VALUES (...);

-- ========== 5. participations テーブル（任意） ==========
-- INSERT INTO participations (program_id, user_id) VALUES (...);
