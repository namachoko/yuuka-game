---
name: stop
description: yuuka-gameのバックエンド（port 3001）とフロントエンド（port 8080）を停止する。「サーバー止めて」「stop」などと言われたときに使う。
disable-model-invocation: true
allowed-tools: Bash
effort: low
---

# yuuka-game サーバー停止

## 1. プロセス特定と停止

```bash
kill $(lsof -ti:3001) 2>/dev/null && echo "バックエンド停止" || echo "バックエンドは起動していません"
kill $(lsof -ti:8080) 2>/dev/null && echo "フロントエンド停止" || echo "フロントエンドは起動していません"
```

## 2. 停止確認

```bash
lsof -ti:3001 && echo "3001 まだ起動中" || echo "3001 停止済み"
lsof -ti:8080 && echo "8080 まだ起動中" || echo "8080 停止済み"
```

## 3. 結果表示

```
🛑 バックエンド: 停止
🛑 フロントエンド: 停止
```
