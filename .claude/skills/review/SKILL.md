---
name: review
description: yuuka-gameのコード変更をレビューする。Vue 3 / Express / PostgreSQL の観点でバグ・設計・セキュリティを確認する。「レビューして」「コード見て」などと言われたときに使う。
disable-model-invocation: false
allowed-tools: Bash, Read, Grep
effort: high
context: fork
agent: Explore
---

# コードレビュー

## 1. 変更内容の把握

まず差分を確認：

```bash
git -C /Users/fukasawaryohma/yuuka-game diff HEAD
git -C /Users/fukasawaryohma/yuuka-game diff --staged
git -C /Users/fukasawaryohma/yuuka-game status
```

## 2. レビュー観点

以下の観点でコードを確認する。

### バグ・ロジック
- Vue 3 `<script setup>` の使い方が正しいか
- `ref()` / `computed()` / `onMounted()` の使い方
- 非同期処理（async/await）のエラーハンドリング
- API レスポンスの型・null チェック漏れ

### API / バックエンド
- Express のルート・ミドルウェアの正しい使い方
- PostgreSQL クエリのSQL インジェクションリスク（プレースホルダー使用確認）
- トランザクションの BEGIN/COMMIT/ROLLBACK が適切か

### フロントエンド（Vue 3）
- コンポーネント間のデータフロー（props/emits）が適切か
- `defineExpose` の使い方
- ハードコードされた URL（`localhost:3001`）の有無
- ESLint エラーの有無

### セキュリティ
- `.env` がコミットされていないか
- ユーザー入力のバリデーション

## 3. レビュー結果フォーマット

```
## レビュー結果

### 🔴 要修正
- （重大な問題）

### 🟡 改善推奨
- （軽微な問題・改善提案）

### 🟢 良い点
- （良い実装）

### 総評
（全体コメント）
```
