---
name: api-test
description: yuuka-gameの全APIエンドポイント（GET /status, GET /logs, POST /feed）の動作確認をcurlで実行する。「APIテスト」「エンドポイント確認」などと言われたときに使う。バックエンドが起動済みであること。
disable-model-invocation: false
allowed-tools: Bash
effort: low
---

# API エンドポイント動作確認

バックエンドが `http://localhost:3001` で起動済みであることを前提とします。

## 1. サーバー起動確認

```bash
lsof -ti:3001 || echo "⚠️ バックエンドが起動していません"
```

起動していなければ `/start` スキルを案内する。

## 2. GET /status

```bash
curl -s http://localhost:3001/status | python3 -m json.tool
```

期待値：`fullness`（0-100）と `last_fed_at` を含むJSONが返る。

## 3. GET /logs

```bash
curl -s http://localhost:3001/logs | python3 -m json.tool
```

期待値：配列形式のJSONが返る（空配列も正常）。

## 4. POST /feed

```bash
curl -s -X POST http://localhost:3001/feed \
  -H "Content-Type: application/json" \
  -d '{"method":"テスト食材","note":"api-testによるテスト"}' \
  | python3 -m json.tool
```

期待値：ステータス 201 + 作成されたログレコードのJSON。

テスト後、このテストデータをDBから削除：

```bash
psql -U fukasawaryohma -d yuuka_game -c "
  DELETE FROM feed_log WHERE note = 'api-testによるテスト';
"
```

## 5. 結果サマリー表示

```
API テスト結果
✅ GET  /status  → 200
✅ GET  /logs    → 200
✅ POST /feed    → 201
```

失敗したエンドポイントは 🔴 で表示し、エラー内容を表示する。
