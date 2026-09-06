# Auto OP Record

TELEPRO Staging — 音声を利用した手術動画ハイライトの操作デモ。

## デモ

https://yukohara2501.github.io/Auto-OP-Record/

VOD一覧 → ハイライト作成 → 候補の確認 → 区間・選択の調整 → 保存。
保存するのはこのブラウザのlocalStorage内のデモ設定のみです。
デモ表示と架空の発話・抽出結果を使用しています。音声認識、AI解析、動画再生・書き出し、認証、サーバー連携は未実装です。
医師の評価・助言・採点は含みません。

## 構成・起動

ビルド不要のHTML/CSS/JavaScript。`index.html`と同じ階層にある画像・アイコンスクリプトを配信します。
`python -m http.server 8080`でローカル確認できます。
GitHub Pagesはmainブランチのルートを公開します。

## 素材

公開デモに実際の手術映像・患者情報・医師の個人名は含みません。
サムネイルはCSSによるデモ表示です。
Lucide v1.17.0（ISCライセンス）を同梱しています。LICENSE-lucide.txtをご覧ください。
