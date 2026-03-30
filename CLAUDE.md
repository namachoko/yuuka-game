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

## 起動方法

```bash
# バックエンド（backend/ディレクトリから実行必須 - .env読み込みのため）
cd /Users/fukasawaryohma/yuuka-game/backend && node index.js

# フロントエンド
cd /Users/fukasawaryohma/yuuka-game/frontend && npm run serve
```

スキル: `/start` で両方起動、`/stop` で停止。

---

## ゲーム仕様

### 満腹度
- 範囲: 0〜100
- 時間減少: **10分ごとに1ポイント自動減少**（約16.7時間でゼロ）
- 上限: 100（超えない）

### 食事と効果
| 食事 | 絵文字 | 回復量 |
|---|---|---|
| 豚バラ | 🥩 | +40 |
| 家系ラーメン | 🍜 | +60 |
| ビール | 🍺 | +20 |

### ストリーク
- 毎日ごはんをあげると連続日数カウント
- 今日カウント済みなら変化なし、昨日から続いていれば+1、途切れたらリセット

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

## DBスキーマ

```sql
-- ステータス（常に1件）
yuuka_status: status_id, fullness, last_fed_at, streak, last_streak_date, created_at, updated_at

-- 給餌ログ
feed_log: log_id, fed_at, method, note, created_at
```

---

## コーディング規約

### 共通
- インデント: 2スペース
- `alert()` 禁止 → インラインメッセージ（`feedMessage` ref）を使う
- API URL は `process.env.VUE_APP_API_URL || 'http://localhost:3001'` で参照

### フロントエンド（Vue 3）
- `<script setup>` 構文を使う
- `defineProps` / `defineEmits` / `defineExpose` はインポート不要（ESLint設定済み）
- コンポーネント構成:
  - `StatusPanel.vue` — ゆうかちゃんの状態表示（満腹度・セリフ・ストリーク）
  - `FeedPanel.vue` — ごはんをあげるUI
  - `FeedLogList.vue` — 給餌履歴一覧
  - `App.vue` — ルート。ログ取得・フィード後の画面更新を管理

### バックエンド（Express）
- DB操作は `pg` の `pool.query()` を使う
- 複数テーブル更新は必ず `BEGIN/COMMIT/ROLLBACK` トランザクション
- SQLインジェクション対策: プレースホルダー（`$1, $2`）必須

---

## デザインガイドライン

- **カラーテーマ**: オレンジ系（プライマリ `#FF7A30`、ライト `#FFB347`）
- **背景**: クリーム色 `#FFF8F0`
- **カード**: 白背景・`border-radius: 24px`・オレンジ系シャドウ
- **フォント**: Hiragino Kaku Gothic ProN / Noto Sans JP
- **モバイルファースト**: `max-width: 480px` 中央寄せ
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
| `/start` / `/stop` | サーバー起動・停止 |
| `/status` | DBから満腹度を直接確認 |
| `/feed-log` | 給餌ログ表示 |
| `/search-log` | ログ検索 |
| `/reset-status` | 満腹度リセット（開発用） |
| `/api-test` | 全APIエンドポイント動作確認 |
| `/pre-push` | push前安全チェック |
| `/add-skill` | 新スキル作成 |

---

## GitHub

リポジトリ: https://github.com/namachoko/yuuka-game.git
ブランチ: `main`
