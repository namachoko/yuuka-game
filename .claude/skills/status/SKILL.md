---
name: status
description: ゆうかちゃんの現在の満腹度・最終給餌時刻をDBから直接確認する。サーバー起動不要。「ゆうかちゃんの状態は？」「今の満腹度は？」などと言われたときに使う。
disable-model-invocation: false
allowed-tools: Bash
effort: low
---

# ゆうかちゃんの状態確認

DBから直接取得して表示します。

## 1. ステータス取得

```bash
psql -U fukasawaryohma -d yuuka_game -c "SELECT fullness, last_fed_at, updated_at FROM yuuka_status LIMIT 1;"
```

## 2. 結果を整形して表示

取得した `fullness` の値をもとにプログレスバーを作成：
- 1ブロック = 10%（例: 80% → `████████░░`）

最終給餌からの経過時間も計算して表示。

## 3. 表示フォーマット例

```
🐣 ゆうかちゃんの状態
満腹度: ████████░░ 80%
最終給餌: 2026/03/26 10:00:00
経過時間: 3時間前
```
