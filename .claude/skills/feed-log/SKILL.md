---
name: feed-log
description: ゆうかちゃんへの給餌ログをDBから取得して表示する。件数を引数で指定可能（デフォルト10件）。「ログ見せて」「給餌履歴」などと言われたときに使う。
disable-model-invocation: false
allowed-tools: Bash
effort: low
argument-hint: [件数]
---

# 給餌ログ表示

引数 `$ARGUMENTS` が指定されていれば件数として使用。未指定なら10件。

## 1. ログ取得

```bash
psql -U fukasawaryohma -d yuuka_game -c "
  SELECT log_id, created_at, method, note
  FROM feed_log
  ORDER BY created_at DESC
  LIMIT $ARGUMENTS;
"
```

`$ARGUMENTS` が空の場合は `10` を使用。

## 2. 表示フォーマット例

```
📋 給餌ログ（直近10件）

#12  2026/03/26 10:00  家系ラーメン  （おいしそう）
#11  2026/03/26 07:30  豚バラ
#10  2026/03/25 21:00  ビール        （ご機嫌）
...
```
