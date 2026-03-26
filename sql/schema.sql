-- -------------------------------------
-- 🐣 ゆうかちゃんの育成ゲーム DBスキーマ
-- DB名：yuuka_game
-- -------------------------------------

-- 満腹度・状態（常に1件だけ存在する想定）
CREATE TABLE yuuka_status (
  status_id SERIAL PRIMARY KEY,
  fullness INTEGER NOT NULL CHECK (fullness BETWEEN 0 AND 100),
  last_fed_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 餌やり履歴（複数件）
CREATE TABLE feed_log (
  log_id SERIAL PRIMARY KEY,
  fed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  method TEXT,         -- 例: "にんじん", "おにぎり"
  note TEXT,           -- 任意メモ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初期ステータスを1件登録（満腹100）
INSERT INTO yuuka_status (fullness, last_fed_at)
VALUES (100, CURRENT_TIMESTAMP);

-- migration: streak追加 (2026-03-26)
ALTER TABLE yuuka_status
  ADD COLUMN IF NOT EXISTS streak INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_streak_date DATE;
