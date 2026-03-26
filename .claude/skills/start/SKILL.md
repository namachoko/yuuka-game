---
name: start
description: yuuka-gameのバックエンド（port 3001）とフロントエンド（port 8080）を起動する。「サーバー起動」「アプリ起動」「start」などと言われたときに使う。
disable-model-invocation: true
allowed-tools: Bash
effort: low
---

# yuuka-game サーバー起動

## 1. ポート使用状況確認

```bash
lsof -ti:3001 && echo "3001 使用中" || echo "3001 空き"
lsof -ti:8080 && echo "8080 使用中" || echo "8080 空き"
```

使用中のポートがあれば、既に起動済みかどうかユーザーに確認する。

## 2. バックエンド起動

`backend/` ディレクトリから起動すること（.env 読み込みのため必須）。

```bash
cd /Users/fukasawaryohma/yuuka-game/backend && node index.js
```

バックグラウンドで実行し、`🚀 Server is running on http://localhost:3001` が出ることを確認。

## 3. フロントエンド起動

```bash
cd /Users/fukasawaryohma/yuuka-game/frontend && npm run serve
```

バックグラウンドで実行し、`http://localhost:8080/` が出ることを確認。

## 4. 起動確認メッセージ

```
✅ バックエンド: http://localhost:3001
✅ フロントエンド: http://localhost:8080
```
