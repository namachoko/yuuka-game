---
name: search-log
description: 食事名やメモのキーワードで給餌ログを検索する。「ラーメンのログ検索して」「豚バラ 何回あげた？」などと言われたときに使う。
disable-model-invocation: false
allowed-tools: Bash
effort: low
argument-hint: [キーワード]
---

# 給餌ログ検索

`$ARGUMENTS` をキーワードとして `method` と `note` を部分一致検索します。

## 1. 検索クエリ実行

```bash
psql -U fukasawaryohma -d yuuka_game -c "
  SELECT log_id, created_at, method, note
  FROM feed_log
  WHERE method ILIKE '%$ARGUMENTS%'
     OR note ILIKE '%$ARGUMENTS%'
  ORDER BY created_at DESC;
"
```

## 2. 件数も表示

ヒット件数を冒頭に表示する。

## 3. 表示フォーマット例

```
🔍 「ラーメン」の検索結果（3件）

#12  2026/03/26 10:00  家系ラーメン
#8   2026/03/24 19:30  家系ラーメン  （2杯目）
#3   2026/03/20 12:00  家系ラーメン
```

ヒットなしの場合は `「○○」に一致するログはありません` と表示。
