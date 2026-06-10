# magi-artifact

MAGI system clone built with Claude Artifact — multi-agent decision making in your browser.

エヴァンゲリオンのMAGIシステムをClaude.aiのArtifact機能で再現したものです。MELCHIOR・BALTHASAR・CASPARの3エージェントが独立して審議し、多数決で最終判定を下します。

## 特徴

- Claude.aiのArtifactとして動作（環境構築不要）
- 追加課金なし（Claude.aiのサブスクリプション内で完結）
- ペルソナ（system prompt）をUIから自由にカスタマイズ可能

## 使い方

1. `magi-system.jsx` の内容をコピー
2. Claude.aiのチャットで「このReactコードをArtifactで表示して」と貼り付ける
3. 審議したい質問を入力して「審議開始」を押すだけ

## 動作環境

Claude.ai（Artifactが使えるプラン）

## 関連記事

- [MAGIシステムをClaudeのArtifactで作ってみた（Qiita）](https://qiita.com/inuta-one/items/258f72283672ff79f894)
