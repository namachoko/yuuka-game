---
name: pre-push
description: GitHubへpushする前の安全確認チェックリストを実行する。ESLintチェック・APIテスト・.envの除外確認・未コミットファイルの確認を行う。「pushしていい？」「push前チェック」などと言われたときに使う。
disable-model-invocation: true
allowed-tools: Bash, Read
effort: medium
---

# push 前チェック

以下を順番に確認します。1つでも失敗したらpushを中止してください。

## 1. .env がコミットに含まれていないか確認

```bash
git -C /Users/fukasawaryohma/yuuka-game diff --cached --name-only | grep -E "^\.env|/\.env"
git -C /Users/fukasawaryohma/yuuka-game log --oneline --all -- "*.env" "**/.env"
```

`.env` が含まれている場合は 🔴 エラーとして即座に中止。

## 2. 未コミットの変更確認

```bash
git -C /Users/fukasawaryohma/yuuka-game status --short
```

未コミットファイルがあれば一覧を表示して確認を促す。

## 3. ESLint チェック

```bash
cd /Users/fukasawaryohma/yuuka-game/frontend && npm run lint
```

エラーがあれば 🔴 として修正を促す。警告は 🟡 で表示。

## 4. API テスト

バックエンドが起動していれば `/api-test` スキルの内容を実行。
起動していなければスキップして 🟡 で表示。

## 5. コミットログ確認

```bash
git -C /Users/fukasawaryohma/yuuka-game log --oneline -5
```

pushするコミット内容を確認する。

## 6. 結果サマリー

```
push 前チェック結果
✅ .env 除外確認
✅ ESLint
🟡 APIテスト（スキップ: サーバー未起動）
✅ コミットログ確認

→ push OK / NG
```

全て✅または🟡のみであれば push を許可。🔴 が1つでもあれば push 禁止。
