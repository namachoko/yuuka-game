---
name: reset-status
description: 開発・テスト用。ゆうかちゃんの満腹度を任意の値にリセットする。引数未指定なら100にリセット。「満腹度をリセット」「空腹状態にして」などと言われたときに使う。
disable-model-invocation: true
allowed-tools: Bash
effort: low
argument-hint: [満腹度 0-100]
---

# ステータスリセット（開発・テスト用）

引数 `$ARGUMENTS` を満腹度として使用。未指定なら `100`。

## 1. 値の検証

`$ARGUMENTS` が 0〜100 の整数かチェック。範囲外ならエラーメッセージを出して中止。

## 2. 実行前確認

```
⚠️ ゆうかちゃんの満腹度を $ARGUMENTS% にリセットします。よろしいですか？ (y/n)
```

確認を取ってから実行する。

## 3. DB更新

```bash
psql -U fukasawaryohma -d yuuka_game -c "
  UPDATE yuuka_status
  SET fullness = $ARGUMENTS,
      updated_at = CURRENT_TIMESTAMP
  WHERE status_id = 1;
"
```

## 4. 結果確認

更新後の値を取得して表示：

```
✅ 満腹度を $ARGUMENTS% にリセットしました
```
