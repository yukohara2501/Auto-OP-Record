# Auto OP Record

TELEPRO Staging — 音声を利用した手術動画ハイライトの操作デモ。

## デモ

https://yukohara2501.github.io/Auto-OP-Record/

Hubの「ハイライトを開く」→ 該当Caseのハイライト・Outcome編集へ直接移動します。
例：`https://yukohara2501.github.io/Auto-OP-Record/#/cases/K-2026-027/highlights`
VOD一覧でもCaseを選べます。存在しないCaseへのリンクはエラーを表示し、別Caseを開きません。
保存するのはこのブラウザのlocalStorage内のデモ設定のみです。`telepro-case-results-v1`にCase別のハイライトとOutcomeを保存し、同一オリジンにあるHubの結果履歴へ反映します。
Caseへ戻るリンクもディープリンクです。実運用で別ドメインを使用する場合は、認証済みの共通APIによる連携が必要です。
デモ表示と架空の発話・抽出結果を使用しています。音声認識、AI解析、動画再生・書き出し、認証、サーバー連携は未実装です。
医師の評価・助言・採点は含みません。

## 構成・起動

ビルド不要のHTML/CSS/JavaScript。ルートのHTML/CSS/JavaScriptを配信します。
`python -m http.server 8080`でローカル確認できます。
GitHub Pagesはmainブランチのルートを公開します。
`node verify-links.cjs`でディープリンクとCase別の保存・マージを検証できます。

## 素材

公開デモに実際の手術映像・患者情報・医師の個人名は含みません。
サムネイルはCSSによるデモ表示です。
Lucide v1.17.0（ISCライセンス）を同梱しています。LICENSE-lucide.txtをご覧ください。
