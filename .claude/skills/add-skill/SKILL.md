---
name: add-skill
description: yuuka-game用の新しいスキルを作成する。スキル名と概要を引数に渡すか、会話の中で指示する。「スキルを追加したい」「新しいスキル作って」などと言われたときに使う。
disable-model-invocation: false
allowed-tools: Bash, Read, Write
effort: medium
argument-hint: [スキル名] [概要]
---

# 新しいスキルの作成

`$ARGUMENTS` からスキル名と概要を読み取る。未指定の場合はユーザーにヒアリングする。

## 1. ヒアリング（引数未指定の場合）

以下を確認する：
- スキル名（英数字・ハイフン、例: `clean-logs`）
- 何をするスキルか（1〜2文）
- どんな言葉で呼び出されるか（トリガーワード）
- 必要なツール（Bash / Read / Write / Grep など）
- 引数は必要か

## 2. ディレクトリ作成

```bash
mkdir -p /Users/fukasawaryohma/yuuka-game/.claude/skills/<スキル名>
```

## 3. SKILL.md 生成

以下のテンプレートをベースに、ヒアリング内容を反映した `SKILL.md` を作成する。

```markdown
---
name: <スキル名>
description: <概要。どんな時に自動起動されるか含める>
disable-model-invocation: <true/false>
allowed-tools: <使用ツール>
effort: <low/medium/high>
argument-hint: <引数の説明（任意）>
---

# <スキルタイトル>

<スキルの手順をステップごとに記述>
```

## 4. 作成後の確認

作成したファイルを表示し、内容が正しいかユーザーに確認する。

## 5. 既存スキル一覧も確認

```bash
ls /Users/fukasawaryohma/yuuka-game/.claude/skills/
```

スキル名の重複がないか確認する。
