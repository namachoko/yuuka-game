# yuuka-game CLAUDE.md

## プロジェクト概要

**ゆうかちゃん（彼女）のお世話育成ゲーム。**
プレイヤーは彼女のためにごはんをあげ、毎日気にかける。
数値管理ゲームではなく、「彼女との関係性を育てるゲーム」。

---

## 組織体制

| 役割 | 担当 | 概要 |
|---|---|---|
| 社長 | ユーザー | 最終意思決定者。大まかな指示を出す |
| 部長 | Claude (`/bucho`) | 社長の指示を解釈し、3者に指示・グリーンライト会議を主導 |
| ディレクター | Claude (`/director`) | ゲームデザイン・UX・世界観の判断 |
| プロデューサー | Claude (`/producer`) | プレイヤー体験・スコープ・価値の判断 |
| PM | Claude (`/pm`) | 実現可能性・工数・品質担保・リスクの判断 |

**原則**: 新機能・改修は `/green-light` で3者合意を取ってから実装する。

---

## 技術スタック

- **フロントエンド**: Vue 3 (`<script setup>`) / Axios
- **バックエンド**: Node.js / Express 5 / PostgreSQL (`pg`)
- **DB**: PostgreSQL（DB名: `yuuka_game`、ユーザー: `fukasawaryohma`）
- **開発環境**: Vue CLI (`npm run serve`) / ポート: フロント8080、バック3001

---

## ディレクトリ構成

```
yuuka-game/
├── .claude/
│   └── skills/          # Claude Code スキル定義（15スキル）
├── backend/
│   ├── index.js         # Express サーバー（APIエンドポイント・満腹度decay）
│   ├── package.json
│   └── .env             # ※git管理外。DATABASE_URL / PORT を設定
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── main.js
│   │   ├── App.vue                   # ルートコンポーネント
│   │   └── components/
│   │       ├── StatusPanel.vue       # 状態表示（満腹度・セリフ・ストリーク）
│   │       ├── FeedPanel.vue         # 給餌UI
│   │       ├── FeedLogList.vue       # 給餌履歴一覧
│   │       └── yuuka.png             # ゆうかちゃんのキャラ画像
│   ├── .env                          # VUE_APP_API_URL=http://localhost:3001
│   ├── vue.config.js
│   └── package.json
├── sql/
│   └── schema.sql       # テーブル定義 + streak追加migration
├── misc/
│   └── UIモック.png
├── CLAUDE.md
└── README.md
```

---

## 起動方法

```bash
# バックエンド（backend/ディレクトリから実行必須 - .env読み込みのため）
cd backend && node index.js

# フロントエンド
cd frontend && npm run serve
```

スキル: `/start` で両方起動、`/stop` で停止。

### 環境変数（backend/.env）

```
DATABASE_URL=postgres://fukasawaryohma@localhost:5432/yuuka_game
PORT=3001
```

---

## ゲーム仕様

### 満腹度
- 範囲: 0〜100
- 時間減少: **10分ごとに1ポイント自動減少**（約16.7時間でゼロ）
- 上限: 100（超えない）
- decay は `setInterval` でサーバー側が実行（`GREATEST(0, fullness - 1)` でSQL更新）

### 食事と効果
| 食事 | 絵文字 | 回復量 |
|---|---|---|
| 豚バラ | 🥩 | +40 |
| 家系ラーメン | 🍜 | +60 |
| ビール | 🍺 | +20 |

### ストリーク
- 毎日ごはんをあげると連続日数カウント
- 今日カウント済みなら変化なし、昨日から続いていれば+1、途切れたらリセット
- ストリーク計算は**日本時間（Asia/Tokyo）基準**

### ゆうかちゃんのセリフ（満腹度別）
| 満腹度 | セリフ |
|---|---|
| 100% | お腹いっぱい！幸せ〜 💕 |
| 80〜99% | まだまだ元気だよ！😊 |
| 60〜79% | そろそろ何か食べたいかも… 🍴 |
| 40〜59% | お腹空いてきた… ごはんほしい 😢 |
| 20〜39% | お腹ペコペコ… 早く… 💦 |
| 1〜19% | もう限界…たすけて… 😵 |

---

## APIエンドポイント

| メソッド | パス | 概要 |
|---|---|---|
| GET | `/status` | ゆうかちゃんの現在状態を返す |
| GET | `/logs` | 直近20件の給餌ログを返す（降順） |
| POST | `/feed` | 給餌を実行。`{ method, note }` を受け取る |

### POST /feed レスポンス例

```json
{
  "log_id": 42,
  "method": "家系ラーメン",
  "note": "おいしかった",
  "restore": 60,
  "streak": 3
}
```

---

## DBスキーマ

```sql
-- ステータス（常に1件）
CREATE TABLE yuuka_status (
  status_id        SERIAL PRIMARY KEY,
  fullness         INTEGER NOT NULL CHECK (fullness BETWEEN 0 AND 100),
  last_fed_at      TIMESTAMP NOT NULL,
  streak           INTEGER NOT NULL DEFAULT 0,
  last_streak_date DATE,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 給餌ログ
CREATE TABLE feed_log (
  log_id     SERIAL PRIMARY KEY,
  fed_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  method     TEXT,       -- 例: "豚バラ", "家系ラーメン", "ビール"
  note       TEXT,       -- 任意メモ
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

※`streak` / `last_streak_date` は2026-03-26に `ALTER TABLE` で追加済み（`sql/schema.sql` 参照）。

---

## コーディング規約

### 共通
- インデント: 2スペース
- `alert()` 禁止 → インラインメッセージ（`feedMessage` ref）を使う
- API URL は `process.env.VUE_APP_API_URL || 'http://localhost:3001'` で参照

### フロントエンド（Vue 3）
- `<script setup>` 構文を使う
- `defineProps` / `defineEmits` / `defineExpose` はインポート不要（ESLint `vue/setup-compiler-macros` 設定済み）
- コンポーネント構成:
  - `StatusPanel.vue` — 満腹度バー・セリフ・ストリークバッジ・最終給餌時刻・エラーバナー
  - `FeedPanel.vue` — 食事選択ボタン・メモ入力・給餌ボタン・インラインフィードバック
  - `FeedLogList.vue` — タイムライン形式の履歴表示・食事絵文字マッピング・空状態
  - `App.vue` — ルート。ログ取得・`handleFeed` で StatusPanel と FeedLogList を同期更新
- 給餌成功時は `@feedSuccess` イベント → App.vue が `fetchLogs()` + `statusPanel.value?.fetchStatus()` を呼ぶ

### バックエンド（Express）
- DB操作は `pg` の `pool.query()` を使う
- 複数テーブル更新は必ず `BEGIN/COMMIT/ROLLBACK` トランザクション
- SQLインジェクション対策: プレースホルダー（`$1, $2`）必須
- `FOOD_RESTORE` マップで食事名 → 回復量を管理。未知の食事名は30を返す

---

## デザインガイドライン

- **カラーテーマ**: オレンジ系（プライマリ `#FF7A30` / `#FF7020`、ライト `#FFB347`）
- **背景**: クリーム色 `#FFF8F0`
- **カード**: 白背景・`border-radius: 24px`・オレンジ系シャドウ
- **フォント**: Hiragino Kaku Gothic ProN / Noto Sans JP
- **モバイルファースト**: `max-width: 480px` 中央寄せ
- **ストリークバッジ**: 1日🔥 / 3日🔥🔥 / 7日以上🔥🔥🔥
- **満腹度バー**: 満（緑） → 中（黄） → 低（赤）のグラデーション
- UIモック参考: `misc/UIモック.png`

---

## スキル一覧

| スキル | 用途 |
|---|---|
| `/bucho` | 社長指示を解釈し3者に指示・会議主導 |
| `/green-light` | 3者合意でGO/STOPを判定 |
| `/director` | ゲームデザイン・世界観レビュー |
| `/producer` | 体験・スコープ・価値レビュー |
| `/pm` | 工数・品質・リスクレビュー |
| `/review` | コード変更をVue 3 / Express / PostgreSQL観点でレビュー |
| `/start` / `/stop` | サーバー起動・停止 |
| `/status` | DBから満腹度を直接確認（サーバー起動不要） |
| `/feed-log` | 給餌ログ表示（件数指定可、デフォルト10件） |
| `/search-log` | 食事名・メモキーワードで給餌ログを検索 |
| `/reset-status` | 満腹度リセット（開発用） |
| `/api-test` | 全APIエンドポイント動作確認（要バックエンド起動） |
| `/pre-push` | push前安全チェック |
| `/add-skill` | 新スキル作成 |

---

## GitHub

リポジトリ: https://github.com/namachoko/yuuka-game.git
ブランチ: `main`
